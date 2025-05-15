import { GetDetailClient, SetClientMatricule } from './client.actions'; // Assurez-vous d'importer le bon chemin pour vos classes

describe('Client Actions', () => {

  describe('GetDetailClient Action', () => {
    it('should create an action with the correct type and payload', () => {
      const action = new GetDetailClient(
        'codeTypeIdntExtn',
        'idntAgnt',
        'idntAgntAcces',
        'idntAgntTech',
        'idntEtabEntt',
        'idntExtnConx',
        'typeCanalAcces',
        'codeEtab',
        'identifiantPersonne'
      );

      expect(GetDetailClient.type).toBe('[Client] Get Detail Client');
      expect(action.codeTypeIdntExtn).toBe('codeTypeIdntExtn');
      expect(action.idntAgnt).toBe('idntAgnt');
      expect(action.idntAgntAcces).toBe('idntAgntAcces');
      expect(action.idntAgntTech).toBe('idntAgntTech');
      expect(action.idntEtabEntt).toBe('idntEtabEntt');
      expect(action.idntExtnConx).toBe('idntExtnConx');
      expect(action.typeCanalAcces).toBe('typeCanalAcces');
      expect(action.codeEtab).toBe('codeEtab');
      expect(action.identifiantPersonne).toBe('identifiantPersonne');
    });
  });

  describe('SetClientMatricule Action', () => {
    it('should create an action with the correct type and payload', () => {
      const clientMatricule = '123456';
      const action = new SetClientMatricule(clientMatricule);

      expect(SetClientMatricule.type).toBe('[Client] Set Client Matricule');
      expect(action.clientMatricule).toBe(clientMatricule);
    });
  });
});
