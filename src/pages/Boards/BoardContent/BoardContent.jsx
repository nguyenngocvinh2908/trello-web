import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { useColorScheme } from '@mui/material/styles'
import ListColumns from './ListColumns/ListColumns'
import * as sort from '~/utils/sort'
import * as formmatters from '~/utils/formatters'
import { DndContext, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects, closestCorners } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import lodash from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { MouseSensor, TouchSensor } from '~/customLibs/dndKitSensor'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

// Animation khi thả (drop) 1 phần tử  - Mặc định nếu style lại thi sau khi thả nó mất luôn cái dragOverlaty (nhớ là hình động khi thả)
const CustomDropAnimation = {
  ideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: 0.5 } } })
}

function BoardContent({ board, createNewColumn, createNewCard }) {
  const { mode } = useColorScheme()
  // https://docs.dndkit.com/api-documentation/sensors
  // Nếu dùng pointerSensor mặc định thì phải kết hợp thuộc tính css touch-action: none ở những phần tử kéo thả - nhưng vẫn còn pug
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Yều cầu chuột phải di chuyển 10px thì mới kích hoạt event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // Nhấn giữ 250ms và dung sai của cảm ứng(dễ hiểu là di chuyển/chênh lệch 5px) thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })

  // Ưu tiên nên kết hợp sử dụng 2 cảm biến mouseSensor và touchSensor để có trải nghiệm tốt trên mobile
  // const sensor = useSensors(pointerSensor)
  const sensor = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng 1 thời điểm chỉ có 1 phần tử card hoặc column được kéo
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  useEffect(() => {
    const orderedColumns = sort.mapOrder(board?.columns, board?.columnOrderIds, '_id')
    // eslint-disable-next-line
    setOrderedColumns(orderedColumns)
  }, [board])

  // Hàm chung xử lý việc cập nhật state trong trường hợp di chuyển Card giữa các column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // Tìm vị trí index của overCard trong column đích (nơi mà active card sắp đc thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // Logic tính toán 'cardIndex mới' (trên hoặc dưới của overCard ) lấy chuẩn từ code của thư viên
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
                      active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      // Nếu không tìm thấy overCard (overCardIndex < 0) thì chèn vào cuối cột (bằng length, không + 1)
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // 3. Clone sâu mảng state cũ để thao tác an toàn (Immutable)
      const nextColumns = lodash.cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(c => c._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(c => c._id === overColumn._id)

      if (nextActiveColumn) {
        // Xóa card ở cái column active (hay là xóa card ở column cũ)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Thêm PlaceholderCard nếu Column rỗng. Bị kéo hết card đi
        if (lodash.isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [formmatters.generatePlaceholderCard(nextActiveColumn)]
        }
        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      if (nextOverColumn) {
        // Kiêm tra xem card đang kéo nó có tồn tại ở overColumn chưa, nếu có thì cần xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Phải cập nhập lại chuẩn dữ liệu columnId trong card sau khi kéo thả card giữa 2 column khác nhau
        const rebuilt_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuilt_activeDraggingCardData)

        // Xóa cái placeholder card đi nếu column thật sự tồn tại 1 phần tử
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      return nextColumns
    })
  }

  // Hàm tìm id của column thông qua cardId của nó
  const findColumnByCardId = (cardId) => {
    // Đoạn này lưu ý, nên dùng column.cards thay vì column.cardOrderIds vì trước handleDragOver chúng ta sẽ làm dữ liệu cho carđ hoàn chỉnh trước rồi mới tạo ra cardOrderIds
    return orderedColumns.find(column => column?.cards?.map(card => card?._id).includes(cardId))
  }

  // Trigger khi bắt đầu kéo (drag) một phần tử
  const handleOnDragStart = (e) => {
    setActiveDragItemId(e?.active?.id)
    setActiveDragItemType(e?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(e?.active?.data?.current)

    // Nếu là kéo card thì mới thì mới thực hiện hành động set giá trị oldColumn
    if (e?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(e?.active?.id))
    }
  }

  // Trigger trong quá trình kéo (drag) một phần tử
  const handleOnDragOver = (e) => {
    // Không làm gì thêm khi kéo phần tử column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại các columns
    const { active, over } = e

    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì return
    if (!active || !over) return

    // activeDraggingCardId là cái card mình đang kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCardId là cái card mình muốn thả (hay tương tác)
    const { id: overCardId } = over

    // Tìm 2 column của 2 cái card active and over
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    // Xử lý logic ở đây khi kéo card qua 2 column khác nhau
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // Trigger khi kết thúc hành động kéo (drag) một phần tử => hành động thả
  const handleOnDragEnd = (e) => {
    const { active, over } = e

    // Kiểm tra nếu không tồn tại over(kéo thả linh tinh ra ngoài thì return tránh lỗi)
    if (!over || !active) return

    // Xử lý kéo thả Cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCardId là cái card mình đang kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCardId là cái card mình muốn thả (hay tương tác)
      const { id: overCardId } = over

      // Tìm 2 column của 2 cái card active and over
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      if (!activeColumn || !overColumn) return
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // Hành động kéo thả trong 2 column khác nhau
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Hành động kéo thả card trong 1 column
        // Lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards.findIndex(card => card._id === activeDragItemId)
        // Lấy vị trí mới tù overColumn
        const newCardIndex = overColumn?.cards.findIndex(card => card._id === overCardId)
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOrderedColumns(prevColumns => {
          // 3. Clone sâu mảng state cũ để thao tác an toàn (Immutable)
          const nextColumns = lodash.cloneDeep(prevColumns)

          // Tìm tới cái Column mà chúng ta đang thả
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          // Cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)
          return nextColumns
        })
      }
    }

    // Xử lý kéo thả Columns trong 1 boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Nếu vị trí kéo thả mới khác với vị trí ban đầu
      if (active.id !== over.id) {
        // Tìm vị trí cũ của column thông qua active
        const oldColumnIndex = orderedColumns.findIndex(column => column._id === active.id)
        const newColumnIndex = orderedColumns.findIndex(column => column._id === over.id)
        // Dùng 'arrayMove' của dnd-kit đê sắp xếp lại mảng Columns ban đầu
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // Xử Lý Gọi Api Để Update Dữ Liệu
        // -------------------------------
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // Set lại giá trị khi kéo thả xong
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  return (
    <DndContext
      // Phần cảm biến
      sensors={sensor}
      // Thuật toán phát hiện (nếu ko có nó thì card có cover lớn sẽ không kéo qua lại giữu các column vì lúc này nó bị conflict giữa card và column), chúng ta sẽ dùng closestConers thày vì dùng closestCenter
      collisionDetection={closestCorners}
      onDragStart={handleOnDragStart}
      onDragOver={handleOnDragOver}
      onDragEnd={handleOnDragEnd}
    >
      <Box sx={
        {
          p: '10px 0',
          backgroundColor: (mode === 'dark' ? '#34495e' : '#1976d2'),
          width: '100%',
          height: (theme) => theme.trelloCustom.boardContentHeight
        }
      }>
        <ListColumns columns={ orderedColumns } createNewColumn={ createNewColumn } createNewCard={ createNewCard }/>
        <DragOverlay dropAnimation={CustomDropAnimation}>
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
