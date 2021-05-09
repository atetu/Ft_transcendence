<template>
  <div class="mini-drawer-offset">
    <virtual-list
      style="height: 360px; overflow-y: auto"
      :data-key="'id'"
      :data-sources="items"
      :data-component="itemComponent"
    />
  </div>
</template>

<script>
import Item from '~/components/channel/message/ScrollItem'

export default {
  data() {
    return {
      itemComponent: Item,
      items: Array.from({ length: 100 }, (_, v) => ({
        id: v + 1,
        content: 'a'.repeat((v % 10) + 3) + v,
      })),
    }
  },
}
</script>
