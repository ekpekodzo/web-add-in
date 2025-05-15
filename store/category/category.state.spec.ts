import { TestBed } from '@angular/core/testing';
import { StateContext } from '@ngxs/store';
import { CategoryState, CategoryStateModel } from './category.state';
import { CategoryApi } from '../../core/service/api/category/category.api';
import { of } from 'rxjs';
import { Store } from '@ngxs/store';

class MockCategoryApi {
  getCategories = jest.fn().mockReturnValue(of({ list: [] })); // Simule une réponse vide
  getCategory = jest.fn().mockReturnValue(of({ id: '1', name: 'Test Category' })); // Simule une catégorie
}

class MockStore {
  dispatch = jest.fn().mockReturnValue(of(null)); // Simule le dispatch de l'action
}

describe('CategoryState', () => {
  let state: CategoryState;
  let mockApi: MockCategoryApi;
  let mockStore: MockStore;

  beforeEach(() => {
    mockApi = new MockCategoryApi();
    mockStore = new MockStore();

    TestBed.configureTestingModule({
      providers: [
        CategoryState,
        { provide: CategoryApi, useValue: mockApi },
        { provide: Store, useValue: mockStore },
      ],
    });

    state = TestBed.inject(CategoryState);
  });

  describe('getCategories', () => {
    it('should load categories and update the state', () => {
      const ctx = {
        patchState: jest.fn(),
      } as unknown as StateContext<CategoryStateModel>;

      state.getCategories(ctx);

      expect(ctx.patchState).toHaveBeenCalledWith({ loading: true });

      // Simule la fin de l'appel API
      expect(mockApi.getCategories).toHaveBeenCalled();
      // On suppose que la liste des catégories vienne d'une API vide

      expect(ctx.patchState).toHaveBeenCalledWith({ loading: true });
    });
  });
});
