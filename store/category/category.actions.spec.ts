import { GetCategories, SelectCategory } from './category.actions'; // Assurez-vous d'importer le bon chemin pour vos classes

describe('Category Actions', () => {

  describe('GetCategories Action', () => {
    it('should create an action with the correct type', () => {
      expect(GetCategories.type).toBe('[Category] Get Categories');
    });
  });

  describe('SelectCategory Action', () => {
    it('should create an action with the correct type and payload', () => {
      const categoryId = 'category123';
      const action = new SelectCategory(categoryId);

      expect(SelectCategory.type).toBe('[Category] Select Category');
      expect(action.id).toBe(categoryId);
    });
  });
});
