import { UpdateAppStateLoading } from "./app-state.actions";

describe('UpdateAppStateLoading', () => {
  it('should create an action with the correct type and payload', () => {
    const loadingProgress = true;
    const action = new UpdateAppStateLoading(loadingProgress);

    expect(UpdateAppStateLoading.type).toBe('[AppState] Update AppState Loading');
    expect(action.loadingProgress).toBe(loadingProgress);
  });

  it('should create an action with loadingProgress set to false', () => {
    const loadingProgress = false;
    const action = new UpdateAppStateLoading(loadingProgress);

    expect(UpdateAppStateLoading.type).toBe('[AppState] Update AppState Loading');
    expect(action.loadingProgress).toBe(loadingProgress);
  });
});
