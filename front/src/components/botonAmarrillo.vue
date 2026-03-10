<template>

    <button class="btn">
        {{ texto }}
    </button>

</template>


<script setup>
 

defineProps({
    texto: String
})

</script>


<style>
.btn {
  background: #f2d00d;
  color: rgb(23, 22, 22);
  border: none;
  padding: 10px 18px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 16px;
  box-shadow: rgb(0, 0, 0, 0.4);
  margin-top: 15px;
}

.btn:hover {
  background: #f2960d;
}
</style>