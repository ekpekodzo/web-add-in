import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Template, TemplateApiResponse } from '../../core/models';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { GetTemplatesByCategory, InsertTemplate, InsertTemplateV2 } from './template.actions';
import { catchError, finalize, of, switchMap, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalCloseData, ModalCloseDataV2 } from '../../core/models/modal-close-data.model';
import { AddinPreview, AddinPreviewV2 } from '../../core/models/addin-preview.model';
import { AddinInputComponent } from '../../shared/components/addin-input/addin-input.component';
import { TemplateParserService } from '../../core/service/business/template-parser.service';
import { TemplateService } from '../../core/service/business/template.service';
import { NeoDialogService } from '@bpce/neo-ng/dialog';
import { TemplateUtils } from '../../core/utils/template.utils';
import { AddinInputV2Component } from '../../shared/components/addin-input-v2/addin-input-v2.component';
import { TemplateApi } from '../../core/service/api/template/template.api';
import { TEMPLATE_DEFAULT_STATE_MODEL } from '../../core/utils/application.constant';

export interface TemplateStateModel {
  listTemplate: Template[];
  selectedTemplate: Template;
  loading: boolean;
}

@State<TemplateStateModel>({
  name: 'template',
  defaults: TEMPLATE_DEFAULT_STATE_MODEL,
})
@Injectable()
export class TemplateState {
  private readonly templateApi: TemplateApi = inject(TemplateApi);
  private readonly templateParserService: TemplateParserService = inject(TemplateParserService);
  private readonly templateService: TemplateService = inject(TemplateService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly neoDialogService: NeoDialogService = inject(NeoDialogService);

  @Selector()
  static getTemplates(state: TemplateStateModel): Template[] {
    return state.listTemplate;
  }

  @Action(GetTemplatesByCategory)
  getTemplatesByCategory(
    ctx: StateContext<TemplateStateModel>,
    { categoryId }: GetTemplatesByCategory
  ) {
    ctx.patchState({ loading: true });

    return this.templateApi.getTemplatesWithDetails(categoryId).pipe(
      tap((templatesApiResponse: TemplateApiResponse) => {
        if (!templatesApiResponse?.list) {
          const errorMessage = templatesApiResponse
            ? "La liste des templates est manquante dans la réponse de l'API"
            : "Aucune réponse de l'API lors de la récupération des templates";
          console.warn(errorMessage);
          throw new Error(errorMessage);
        }
        ctx.patchState({ listTemplate: templatesApiResponse.list });
      }),
      catchError((error) => {
        console.error('Erreur lors de la récupération des templates: ', error);
        ctx.patchState({ listTemplate: [] });
        return throwError(() => error);
      }),
      finalize(() => ctx.patchState({ loading: false }))
    );
  }

  @Action(InsertTemplate)
  insertTemplate(ctx: StateContext<TemplateStateModel>, { template }: InsertTemplate) {
    ctx.patchState({ loading: true });

    const templateVariables = this.templateParserService.extractVariables(
      template.tempateDocument.content
    );

    const insertModele$ = (corps: string) =>
      this.templateService.insertTemplateIntOutlook(corps, template).pipe(
        tap(() => {
          ctx.patchState({
            loading: false,
            selectedTemplate: template,
          });
        }),
        catchError((error) => {
          console.error(`Erreur lors de l'insertion du modèle de mail :`, error);
          ctx.patchState({ loading: false });
          return of(void 0);
        }),
        takeUntilDestroyed(this.destroyRef)
      );

    if (templateVariables.length !== 0) {
      this.neoDialogService
        .open<AddinPreview, ModalCloseData>(AddinInputComponent, {
          data: { variables: templateVariables },
        })
        .pipe(
          switchMap((ref) => ref.afterClose()),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((result) => {
          if (result) {
            const filledTemplate = TemplateUtils.replaceVariablesInHtml(
              template.tempateDocument.content,
              result
            );
            const resultHtml = TemplateUtils.replaceEmailInHtml(filledTemplate, result);
            insertModele$(resultHtml).subscribe();
            console.log('afterClose result exist', result);
          } else {
            console.log('afterClose no', result);
            insertModele$(template.tempateDocument.content).subscribe();
          }
        });
    } else {
      insertModele$(template.tempateDocument.content).subscribe();
    }
  }

  @Action(InsertTemplateV2)
  insertTemplateV2(ctx: StateContext<TemplateStateModel>, { template }: InsertTemplateV2) {
    ctx.patchState({ loading: true });
    const templateVariables = this.templateParserService.parseInputFields(
      template.tempateDocument.content
    );

    const insertModele$ = (corps: string) =>
      this.templateService.insertTemplateWithVariable(corps, template).pipe(
        tap(() => {
          ctx.patchState({
            loading: false,
            selectedTemplate: template,
          });
        }),
        catchError((error) => {
          console.error(`Erreur lors de l'insertion du modèle de mail :`, error);
          ctx.patchState({ loading: false });
          return of(void 0);
        }),
        takeUntilDestroyed(this.destroyRef)
      );

    if (templateVariables.length !== 0) {
      this.neoDialogService
        .open<AddinPreviewV2, ModalCloseDataV2>(AddinInputV2Component, {
          data: { variablesV2: templateVariables },
        })
        .pipe(
          switchMap((ref) => ref.afterClose()),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe((result) => {
          if (result) {
            const filledTemplate = TemplateUtils.replaceWithUserDataInHtml(
              template.tempateDocument.content,
              result
            );
            insertModele$(filledTemplate).subscribe();
            console.log('afterClose result exist', result);
          } else {
            console.log('afterClose no', result);
            insertModele$(template.tempateDocument.content).subscribe();
          }
        });
    } else {
      insertModele$(template.tempateDocument.content).subscribe();
    }
  }
}
