<template>
  <div class="card">
    <div class="card__id">
      <p class="card__text">id:</p>
      <p class="card__value">{{ card.id }}</p>
    </div>
    <p class="card__value">{{ card.text }}</p>
    <p class="del"
       @click="deleteCard(card.id,idx)">X</p>
    <slot/>
  </div>
</template>


<script>

import {mapMutations} from "vuex";

export default {
  name: "Card",
  components: {},
  props: {
    card: Object,
    idx:String
  },
  methods: {
    ...mapMutations([
      'setDeleteCard'
    ]),
    deleteCard(card,idx) {
      console.log(idx)
      console.log(card)
      this.setDeleteCard({id:card,lane:idx})
    }
  }
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: space-around;
  background: grey;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  font-size: 14px;
  cursor: pointer;
}
.card__id{
  display: flex;
  align-items: center;
}
.card__value{
  display: flex;
  justify-content: flex-start;
  color: lightgrey;
}
.card__text{margin: 5px;
color: white}
.del {
  color: white;
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
}

.del:hover {
  color: yellow;
}
</style>