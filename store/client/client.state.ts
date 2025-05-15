import { inject, Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { GetDetailClient, SetClientMatricule } from './client.actions';
import { ClientApi } from '../../core/service/api/client/client.api';
import { catchError, map, of } from 'rxjs';
import { DetailPersonne } from '../../core/models/detail-personne.model';
import { CLIENT_DEFAULT_STATE_MODEL } from '../../core/utils/application.constant';

export interface ClientStateModel {
  matricule: string;
  loading: boolean;
  detailPerson: Partial<DetailPersonne>;
}

@State<ClientStateModel>({
  name: 'client',
  defaults: CLIENT_DEFAULT_STATE_MODEL,
})
@Injectable()
export class ClientState {
  private readonly clientApi: ClientApi = inject(ClientApi);

  @Selector()
  static getClientMatricule(state: ClientStateModel): string {
    return state.matricule;
  }

  @Action(SetClientMatricule)
  setClientMatricule(ctx: StateContext<ClientStateModel>, { clientMatricule }: SetClientMatricule) {
    ctx.patchState({ loading: true, matricule: clientMatricule });
  }

  @Action(GetDetailClient)
  getDetailClient(
    ctx: StateContext<ClientStateModel>,
    {
      codeTypeIdntExtn,
      idntAgnt,
      idntAgntAcces,
      idntAgntTech,
      idntEtabEntt,
      idntExtnConx,
      typeCanalAcces,
      codeEtab,
      identifiantPersonne,
    }: GetDetailClient
  ) {
    const partialState: Partial<ClientStateModel> = {
      loading: true,
      matricule: identifiantPersonne,
    };
    return this.clientApi
      .getDetailPersonne(
        codeTypeIdntExtn,
        idntAgnt,
        idntAgntAcces,
        idntAgntTech,
        idntEtabEntt,
        idntExtnConx,
        typeCanalAcces,
        codeEtab,
        identifiantPersonne
      )
      .pipe(
        map((soapResponse) => {
          const detailPersonne: DetailPersonne = this.clientApi.extractDataFromXml(soapResponse);
          console.info(detailPersonne);
          ctx.patchState({
            ...partialState,
            detailPerson: detailPersonne,
            loading: false,
          });
        }),

        catchError((error) => {
          console.error(
            'LoadDetailClient: Erreur lors de la récupération des données client:',
            error
          );
          ctx.patchState({ ...partialState, detailPerson: {}, loading: false });
          return of([]);
        })
      );
  }
}
