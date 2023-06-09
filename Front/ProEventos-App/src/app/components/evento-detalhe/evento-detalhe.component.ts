// Angular
import { Component, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Import
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

// Application
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';
import { Lote } from '@app/models/Lote';
import { LoteService } from '@app/services/lote.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent {
  form: FormGroup;
  evento = {} as Evento;
  estadoSalvar = 'post';
  eventoId?: number;
  modalRef?: BsModalRef;
  loteAtual = { id: 0, nome: '', indice: 0 };
  tituloLote: string[] = [];

  get modoEditar(): boolean {
    return this.estadoSalvar === 'put';
  }

  get lotes(): FormArray {
    return this.form.get('lotes') as FormArray;
  }

  get f(): any {
    return this.form.controls;
  }

  get bsConfig(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY HH:mm',
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }

  get bsConfigLote(): any {
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY',
      containerClass: 'theme-default',
      showWeekNumbers: false
    }
  }

  constructor(private fb: FormBuilder, private localeService: BsLocaleService,
              private activatedRouter: ActivatedRoute, private eventoService: EventoService,
              private spinner: NgxSpinnerService, private toaster: ToastrService,
              private router: Router, private loteService: LoteService,
              private modalService: BsModalService
  )
  {
    this.form = new FormGroup({});
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {
    this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id')!;


    if (this.eventoId != null && this.eventoId != 0) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(this.eventoId).subscribe(
        (evento: Evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
          this.evento.lotes.forEach(lote => {
            this.lotes.push(this.criarLote(lote));
          });
          // this.carregarLotes();
        },
        (error: any) => {
          this.toaster.error('Erro ao tentar carregar evento', 'Erro!')
          console.error(error);
        }
      ).add(() => this.spinner.hide());
    }
  }

  public ngOnInit(): void {
    this.validation();
    this.carregarEvento();


    this.lotes.controls.forEach((lote: AbstractControl, i: number) => {
      lote.get('nome')?.valueChanges.subscribe((valor: string) => {
        this.tituloLote[i] = this.retornaTitulo(valor);
      });
    });

  }

  public validation(): void {
    this.form = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [ Validators.required, Validators.max(10000), Validators.pattern(/^[0-9]*$/)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imageURL: ['', Validators.required],
      lotes: this.fb.array([])
    });
  }

  adicionarLote(): void {
    this.lotes.push(this.criarLote({id: 0} as Lote));
  }

  criarLote(lote: Lote): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio, Validators.required],
      dataFim: [lote.dataFim, Validators.required],
    });
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  public cssValidator(campoForm :FormControl | AbstractControl | null) : any {
    return {
      'is-invalid': campoForm?.errors && campoForm?.touched,
      'is-valid': campoForm?.valid && campoForm?.touched
    }
  }

  public retornaTitulo(nome: string): string{
    return nome === null || nome === '' ? 'Nome do lote' : nome;
  }

  public salvarEvento(): void {
    this.spinner.show();
    if (this.form.valid) {

      this.evento = (this.estadoSalvar === 'post') ? { ...this.form.value } : { id: this.evento.id, ...this.form.value };
      this.eventoService.save(this.evento).subscribe(
        (eventoRetorno: Evento) => {
          this.toaster.success('Evento salvo com Sucesso!', 'Salvo');
          this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`])
        },
        (error: any) => {
          console.log(error);
          this.spinner.hide();
          this.toaster.error('Erro ao tentar salvar evento', 'Erro');
        },
        () => this.spinner.hide(),
      );
    }
  }

  public salvarLote(): void {

    if (this.eventoId !== undefined) {
      if (this.form.controls['lotes'].valid) {
        this.spinner.show();
        this.loteService.saveLote(this.eventoId, this.form.value.lotes).subscribe(
          () => {
            this.toaster.success('Lotes salvos com sucesso.', 'Salvo!');
            this.lotes.reset();
          },
          (error: any) => {
            this.toaster.error('Erro ao tentar salvar lotes.', 'Erro');
            console.error(error);
          }
        ).add(() => this.spinner.hide());
      }
    }
  }

  public removerLote(template: TemplateRef<any>, indice: number): void {

    this.loteAtual.id = this.lotes.get(indice + '.id')?.value;
    this.loteAtual.nome = this.lotes.get(indice + '.nome')?.value;
    this.loteAtual.indice = indice;

    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });

  }

  confirmDeleteLote(): void {
    this.modalRef?.hide();

    this.loteService.deleteLote(this.eventoId!, this.loteAtual.id).subscribe(
      () => {
        this.toaster.success('Lote deletado com sucesso.', 'Sucesso!');
        this.lotes.removeAt(this.loteAtual.indice);
      },
      (error: any) => {
        this.toaster.error(`Erro ao tentar deletar o lote ${this.loteAtual.id}.`, 'Erro!');
        console.error(error);
      }
    )
  }

  declineDeleteLote(): void {
    this.modalRef?.hide();
  }
}
