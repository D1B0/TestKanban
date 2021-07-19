<template>
  <div :id="idx">
    <Container group-name="kanban-block"
               @drag-start="handleDragStart(idx, $event)"
               @drop="handleDrop(idx, $event)"
               :get-child-payload="getChildPayload"
               :drop-placeholder="{className:'placeholder'}">
      <Draggable v-for="card in board"
                 :key="card.id"
                 class="cards">
        <Card :card="card"
              :idx="idx"
        />
      </Draggable>
      <div v-show="formVisible" class="new-task">
        <form>
          <textarea v-model="newTask" placeholder="Напите задачу"/>
          <button class="btn" type="button" @click="addNewTask(idx,board)">Добавить карточку</button>
        </form>
      </div>
      <button class="btn" v-show="!formVisible" type="button" @click="formVisible=!formVisible">+ Добавить карточку</button>

    </Container>
    <slot/>
  </div>
</template>

<script>
import {Container, Draggable} from 'vue-smooth-dnd'
import Card from "./Card";
import {mapGetters} from "vuex";


export default {
  name: 'Boards',
  props: {
    idx: String,
    board: Array
  },
  components: {
    Card,
    Container,
    Draggable
  },
  data: () => ({
    cards: {},
    draggingCard: {
      lane: '',
      index: -1,
      cardData: {},

    },
    newTask: '',
    formVisible:false
  }),
  methods: {
    ...mapGetters(['GET_BOARD','GET_BOARD_LENGTH']),
    handleDragStart(lane, dragResult) {
      this.$emit('handleDragStart', lane, dragResult)

    },
    handleDrop(lane, dropResult) {
      this.$emit('handleDrop', lane, dropResult)
    },
    getChildPayload(index) {
      return {index}
    },
    addNewTask(lane) {
      this.formVisible=!this.formVisible
      this.$emit('addNewTask', lane, this.newTask)
    }

  },

  mounted() {
    this.cards = this.GET_BOARD()
  }
}
</script>

<style scoped>
.btn{
  display: flex;
  justify-content: flex-start;
  background: dimgrey;
  color: lightgray;
}
textarea{
  padding: 5px 20px 5px 20px;
  background: dimgrey;
  color: white;
  display: flex;
  justify-content: flex-start;
  width: 300px;
  height: 80px;
}
textarea::placeholder{
  color: lightgray;
}
</style>