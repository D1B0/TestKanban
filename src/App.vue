<template>
  <div id="app" class="kanban">
    <Header/>
    <div class="board">
      <div class="lane" v-for="(board,idx) in cards"
           :key="idx"

      >
        <div :class="idx">{{ idx }} ({{ board.length }})</div>
        <Board :idx="idx" :board="board"
               @handleDragStart="handleDragStart"
               @handleDrop="handleDrop"
               @addNewTask="addNewTask">

        </Board>
      </div>
    </div>
  </div>
</template>

<script>

import Header from "./components/Header";
import Board from "./components/Board";
import {mapGetters, mapMutations, mapActions} from 'vuex'

export default {
  name: 'App',
  data() {
    return {
      cards: {}
    }
  },
  components: {
    Header,
    Board,
  },
  methods: {
    ...mapGetters([
      'GET_BOARD'
    ]),
    ...mapMutations([
      'setBoardData'
    ]),
    ...mapActions([
      'login',
      'fetchData',
      'sendDataToServer',
      'sendNewTaskToServer',
        'refreshToken'
    ]),

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
      this.cards[lane].forEach(el => {
        el.seq_num = this.cards[lane].findIndex(item => item.id === el.id)
        el.row = Object.keys(this.cards).findIndex(item => item === lane)
      })
      this.setBoardData(this.cards[lane])
      this.cards[lane].forEach(el => this.sendDataToServer(el))


    },
    getChildPayload(index) {
      return {index}
    },
    addNewTask(lane, text) {
      if (!text) {
        return false
      } else {
        let data = {
          row: Object.keys(this.cards).findIndex(item => item === lane),
          text: text,
          seq_num: this.cards[lane].length
        }
        this.sendNewTaskToServer(data)

      }

    }

  },
  mounted() {
    this.login({username: "DenisBogachev", password: "helloTest16121990"})
    this.cards=this.GET_BOARD()
  },

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

.kanban {
}

.board {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
}

@media (max-width: 400px) {
  .board {
    margin: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.lane {
  background: darkslategray;
  width: 300px;
  border-radius: 5px;
  margin: 0 20px;
  box-shadow: 0 2px 2px 0 rgba(33, 33, 33, 0.1);
  padding-bottom: 10px;
}

.lane-title {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 18px;
}

.placeholder {
  background: darkgrey;
  border-radius: 10px;
  transform: scaleY(0.85);
  transform-origin: 0% 0%;

}

.cards {
  margin-top: 5px;
  margin-bottom: 5px;
}

.HOLD, .PROGRESS, .REVIEW, .APPROVED {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 20px;
  width: 300px;
  height: 80px;
  background: orange;
  color: white;
  font-size: 20px;

}

.PROGRESS {
  background: cornflowerblue;
}

.REVIEW {
  background: yellow;
}

.APPROVED {
  background: greenyellow;
}

</style>
