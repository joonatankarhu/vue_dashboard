<template>
  <v-dialog v-model="isChangingColor" width="auto">
    <v-card class="flex-column justify-center">
      <v-color-picker 
        v-model="localSelectedColor" 
        hide-inputs 
      >
      </v-color-picker>
      <v-card-actions class="flex-column justify-center py-5 px-10">
        <v-btn 
          color="primary" 
          @click="$emit('update-color', localSelectedColor)"
          class="mb-5"
          block 
        >
          Save
        </v-btn>
        <v-btn
          color="secondary" 
          @click="$emit('close-dialog')"
          class="ma-0"
          block 
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'EditColorDialog',
  props: ['selectedColor', 'isChangingColor'],
  data() {
    return {
      localSelectedColor: ''
    }
  },
  mounted() {
    this.localSelectedColor= this.selectedColor
  }
}
</script>
<style>
  
</style>