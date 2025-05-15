export class GetCategories {
  static readonly type = '[Category] Get Categories';
}

export class SelectCategory {
  static readonly type = '[Category] Select Category';
  constructor(public readonly id: string) {}
}
