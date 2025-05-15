import { Injectable, inject } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Category, CategoryApiResponse } from '../../core/models';
import { CategoryApi } from '../../core/service/api/category/category.api';
import { GetCategories, SelectCategory } from './category.actions';
import { catchError, finalize, switchMap, tap, throwError } from 'rxjs';
import { GetTemplatesByCategory } from '../template/template.actions';
import { CATEGORY_DEFAULT_STATE_MODEL } from '../../core/utils/application.constant';

export interface CategoryStateModel {
  listCategory: Category[];
  selectedCategory: Category;
  loading: boolean;
}

@State<CategoryStateModel>({
  name: 'category',
  defaults: CATEGORY_DEFAULT_STATE_MODEL,
})
@Injectable()
export class CategoryState {
  private readonly categoryApi: CategoryApi = inject(CategoryApi);
  private readonly store = inject(Store);

  @Selector()
  static getCategories(state: CategoryStateModel): Category[] {
    return state.listCategory;
  }

  @Selector()
  static getSelectedCategory(state: CategoryStateModel): Partial<Category> | undefined {
    return state.selectedCategory;
  }

  @Action(GetCategories)
  getCategories(ctx: StateContext<CategoryStateModel>) {
    ctx.patchState({ loading: true });
    return this.categoryApi.getCategories().pipe(
      tap((categoryApiResponse: CategoryApiResponse) => {
        if (categoryApiResponse) {
          ctx.patchState({
            listCategory: categoryApiResponse.list,
          });
        }
      }),
      catchError((error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        ctx.patchState({
          listCategory: [],
        });
        return throwError(() => error);
      }),
      finalize(() => {
        ctx.patchState({ loading: false });
      })
    );
  }

  @Action(SelectCategory)
  selectCategory(ctx: StateContext<CategoryStateModel>, { id }: SelectCategory) {
    ctx.patchState({ loading: true });

    return this.categoryApi.getCategory(id).pipe(
      tap((category) =>
        ctx.patchState({
          selectedCategory: category,
        })
      ),
      switchMap((category) => {
        if (!category?.id) {
          console.warn('Category ID is null or undefined, skipping GetTemplatesByCategory');
          return throwError(() => new Error('Category ID is null or undefined'));
        }
        return this.store.dispatch(new GetTemplatesByCategory(category.id)).pipe(
          catchError((error) => {
            console.error('Erreur lors du dispatch de GetTemplatesByCategory:', error);
            return throwError(() => error);
          })
        );
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération des données de la category:', error);
        ctx.patchState({
          selectedCategory: {
            id: '',
            name: '',
          },
        });
        return throwError(() => error);
      }),
      finalize(() => {
        ctx.patchState({ loading: false });
      })
    );
  }
}
