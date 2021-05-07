import { Channel, ChannelVisibility } from '~/models'

const state = () => ({
  list: [
    {
      id: 1,
      name: 'the first',
      visibility: ChannelVisibility.PUBLIC,
    },
    {
      id: 2,
      name: 'the second',
      visibility: ChannelVisibility.PUBLIC,
    },
  ] as Channel[],
})

export default state
export type State = ReturnType<typeof state>
