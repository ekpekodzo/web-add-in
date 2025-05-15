import { Template } from '../../core/models';

export class InsertTemplate {
  static readonly type = '[Template] Insert Template';
  constructor(public template: Template) {}
}

export class InsertTemplateV2 {
  static readonly type = '[Template] Insert Template V2';
  constructor(public template: Template) {}
}

export class GetTemplatesByCategory {
  static readonly type = '[Template] Get Templates By Category';
  constructor(public categoryId: string) {}
}
