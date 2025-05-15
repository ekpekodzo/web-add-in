import { Template } from '../../core/models';
import {
  InsertTemplate,
  InsertTemplateV2,
  GetTemplatesByCategory
} from './template.actions'; // Assurez-vous d'importer le bon chemin pour vos classes

describe('Template Actions', () => {
  
  describe('InsertTemplate Action', () => {
    it('should create an action with the correct type and payload', () => {
      const template: Template = { id: '1', name: 'Test Template' } as Template; // Remplacez par un exemple réel
      const action = new InsertTemplate(template);

      expect(InsertTemplate.type).toBe('[Template] Insert Template');
      expect(action.template).toEqual(template);
    });
  });

  describe('InsertTemplateV2 Action', () => {
    it('should create an action with the correct type and payload', () => {
      const template: Template = { id: '2', name: 'Test Template V2' } as Template; // Remplacez par un exemple réel
      const action = new InsertTemplateV2(template);

      expect(InsertTemplateV2.type).toBe('[Template] Insert Template V2');
      expect(action.template).toEqual(template);
    });
  });

  describe('GetTemplatesByCategory Action', () => {
    it('should create an action with the correct type and payload', () => {
      const categoryId = 'category123';
      const action = new GetTemplatesByCategory(categoryId);

      expect(GetTemplatesByCategory.type).toBe('[Template] Get Templates By Category');
      expect(action.categoryId).toBe(categoryId);
    });
  });
});
