export class UpdateAppStateLoading {
  static readonly type = '[AppState] Update AppState Loading';
  constructor(public loadingProgress: boolean) {}
}
