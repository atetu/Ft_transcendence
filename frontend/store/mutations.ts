import { State } from './state'

export default {
  setDrawerState(state: State, value: boolean) {
    state.drawer = value
  },
}
