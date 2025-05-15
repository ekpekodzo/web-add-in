import { Selector, State } from '@ngxs/store';
import { CategoryState, CategoryStateModel } from '../category/category.state';
import { TemplateState, TemplateStateModel } from '../template/template.state';
import { Injectable } from '@angular/core';
import { Category, Template } from '../../core/models';
import { ClientState, ClientStateModel } from '../client/client.state';
import { DetailPersonne } from '../../core/models/detail-personne.model';
import {
  CATEGORY_DEFAULT_STATE_MODEL,
  TEMPLATE_DEFAULT_STATE_MODEL,
  CLIENT_DEFAULT_STATE_MODEL,
} from '../../core/utils/application.constant';

export interface AppStateModel {
  category: CategoryStateModel;
  template: TemplateStateModel;
  client: ClientStateModel;
  loading: boolean;
}

@State<AppStateModel>({
  name: 'app',
  children: [CategoryState, TemplateState, ClientState],
  defaults: {
    category: CATEGORY_DEFAULT_STATE_MODEL,
    template: TEMPLATE_DEFAULT_STATE_MODEL,
    client: CLIENT_DEFAULT_STATE_MODEL,
    loading: false,
  },
})
@Injectable()
export class AppState {
  @Selector()
  static getAppState(state: AppStateModel): AppStateModel {
    return state;
  }

  @Selector()
  static getCategories(state: AppStateModel): Category[] {
    return state.category.listCategory;
  }

  @Selector()
  static getSelectedCategory(state: AppStateModel): Category {
    return state.category.selectedCategory;
  }

  @Selector()
  static getTemplates(state: AppStateModel): Template[] {
    return state.template.listTemplate;
  }

  @Selector()
  static getTemplate(state: AppStateModel): Template {
    return state.template.selectedTemplate;
  }

  @Selector()
  static loading(state: AppStateModel): boolean {
    return state.category.loading && state.template.loading;
  }

  @Selector()
  static getDetailPerson(state: AppStateModel): Partial<DetailPersonne> | undefined {
    return state.client.detailPerson;
  }
}
