<template>
  <div id="app" class="kanban">
    <Header/>
    <div class="board">
      <div class="lane">
        <h2 class="lane-title">NewTask</h2>
        <Container group-name="kanban-block"
                   @drag-start="handleDragStart('backlog', $event)"
                   @drop="handleDrop('backlog', $event)"
                   :get-child-payload="getChildPayload"
                   :drop-placeholder="{className:'placeholder'}">
          <Draggable v-for="card in cards.backlog"
                     :key="card.id"
                     class="cards">
            <Card :card="card"

            />
          </Draggable>
          <div class="new-task">
            <form>
              <input type="text" id="backlog">
              <button type="button" @click="doSomething('backlog')">Создать новую задачу</button>
            </form>
          </div>
        </Container>
      </div>
      <div class="lane">
        <h2 class="lane-title">Development</h2>
        <Container group-name="kanban-block"
                   @drag-start="handleDragStart('dev', $event)"
                   @drop="handleDrop('dev', $event)"
                   :get-child-payload="getChildPayload"
                   :drop-placeholder="{className:'placeholder'}">
          <Draggable v-for="card in cards.dev"
                     :key="card.id"
                     class="cards"
          >
            <Card :card="card"
            />
          </Draggable>
          <div class="new-task">
            <form>
              <input type="text" id="dev">
              <button type="button" @click="doSomething('dev')">Создать новую задачу</button>
            </form>
          </div>
        </Container>
      </div>
      <div class="lane">
        <h2 class="lane-title">Test</h2>
        <Container group-name="kanban-block"
                   @drag-start="handleDragStart('testes', $event)"
                   @drop="handleDrop('testes', $event)"
                   :get-child-payload="getChildPayload"
                   :drop-placeholder="{className:'placeholder'}">
          <Draggable v-for="card in cards.testes"
                     :key="card.id"
                     class="cards"
          >
            <Card :card="card"
            />
          </Draggable>
          <div class="new-task">
            <form>
              <input type="text" id="testes">
              <button type="button" @click="doSomething('testes')">Создать новую задачу</button>
            </form>
          </div>
        </Container>
      </div>
      <div class="lane">
        <h2 class="lane-title">Finished</h2>
        <Container group-name="kanban-block"
                   @drag-start="handleDragStart('finished', $event)"
                   @drop="handleDrop('finished', $event)"
                   :get-child-payload="getChildPayload"
                   :drop-placeholder="{className:'placeholder'}">
          <Draggable v-for="card in cards.finished"
                     :key="card.id"
                     class="cards"
          >
            <Card :card="card"/>
          </Draggable>
          <div class="new-task">
            <form>
              <input type="text" id="finished">
              <button type="button" @click="doSomething('finished')">Создать новую задачу</button>
            </form>
          </div>
        </Container>
      </div>
    </div>
  </div>
</template>

<script>

import Header from "./components/Header";
import Card from "./components/Card";
import initialCards from './initialCards'
import {Container, Draggable} from 'vue-smooth-dnd'

export default {
  name: 'App',
  components: {
    Header,
    Card,
    Container,
    Draggable
  },
  data: () => ({
    cards: {
      backlog: initialCards.backlog,
      dev: initialCards.dev,
      testes: initialCards.testes,
      finished: [],
    },
    draggingCard: {
      lane: '',
      index: -1,
      cardData: {},

    },
    newTaskBacklog: "",
    newTaskTest: "",
    newTaskDev: "",
    newTaskFinish: "",
  }),
  methods: {
    handleDragStart(lane, dragResult) {
      const {payload, isSource} = dragResult
      if (isSource) {
        this.draggingCard = {
          lane,
          index: payload.index,
          cardData: {
            ...this.cards[lane][payload.index]
          }

        }
      }

    },
    handleDrop(lane, dropResult) {

      const {removedIndex, addedIndex} = dropResult;
      if (lane === this.draggingCard.lane && removedIndex === addedIndex) {
        return;
      }
      if (removedIndex !== null) {
        this.cards[lane].splice(removedIndex, 1)
      }
      if (addedIndex !== null) {
        this.cards[lane].splice(addedIndex, 0, this.draggingCard.cardData)
      }
    },
    getChildPayload(index) {
      return {index,}
    },
    doSomething(lane){
      let data={
        id: new Date().getTime(),
        text: document.getElementById(lane).value
      }
      this.cards[lane].push(data)
      document.getElementById(lane).value = ''


    }

  }

}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.board {
  display: flex;
  justify-content: flex-start;
  margin: 30px 20px;
  align-items: flex-start;
}

.lane {
  background: var(--color-grey);
  width: 200px;
  border-radius: 5px;
  margin: 0 20px;
  box-shadow: 0 2px 2px 0 rgba(33, 33, 33, 0.1);
  padding: 10px
}

.lane-title {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 18px;
}

.placeholder {
  background: rgba(33, 33, 33, 0.08);
  border-radius: 10px;
  transform: scaleY(0.85);
  transform-origin: 0% 0%;

}

.cards {
  margin-top: 5px;
  margin-bottom: 5px;
}

</style>
