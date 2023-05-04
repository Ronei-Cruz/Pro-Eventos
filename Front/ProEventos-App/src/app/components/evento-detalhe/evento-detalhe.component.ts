// Angular
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// Import
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

// Application
import { Evento } from '@app/models/Evento';
import { EventoService } from '@app/services/evento.service';

@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent {
  form: FormGroup;
  evento = {} as Evento;
  estadoSalvar = 'post';

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

  constructor(private fb: FormBuilder, private localeService: BsLocaleService,
              private router: ActivatedRoute, private eventoService: EventoService,
              private spinner: NgxSpinnerService, private toaster: ToastrService)
  {
    this.form = new FormGroup({});
    this.localeService.use('pt-br');
  }

  public carregarEvento(): void {
    const eventoIdParam = this.router.snapshot.paramMap.get('id');


    if (eventoIdParam != null) {
      this.spinner.show();

      this.estadoSalvar = 'put';

      this.eventoService.getEventoById(+eventoIdParam).subscribe(
        (evento: Evento) => {
          this.evento = { ...evento };
          this.form.patchValue(this.evento);
        },
        (error: any) => {
          this.spinner.hide();
          this.toaster.error('Erro ao tentar carregar evento', 'Erro!')
          console.error(error);
        },
        () => this.spinner.hide(),
      );
    }
  }

  public ngOnInit(): void {
    this.validation();
    this.carregarEvento();
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
    });
  }

  public resetForm(event: any): void {
    event.preventDefault();
    this.form.reset();
  }

  public cssValidator(campoForm :FormControl) : any {
    return {
      'is-invalid': campoForm?.errors && campoForm?.touched,
      'is-valid': campoForm?.valid && campoForm?.touched
    }
  }

  public salvarAlteracao(): void {
    this.spinner.show();
    if (this.form.valid) {

      this.evento = (this.estadoSalvar === 'post') ? { ...this.form.value } : { id: this.evento.id, ...this.form.value };
      this.eventoService.save(this.evento).subscribe(
        () => this.toaster.success('Evento salvo com Sucesso!', 'Salvo'),
        (error: any) => {
          console.log(error);
          this.spinner.hide();
          this.toaster.error('Erro ao tentar salvar evento', 'Erro');
        },
        () => this.spinner.hide(),
      );
      
      /*
      ----> PARTE QUE DÁ ERRO <----
      this.eventoService[this.estadoSalvar](this.evento).subscribe(
        () => this.toaster.success('Evento salvo com Sucesso!', 'Salvo'),
        (error: any) => {
          console.log(error);
          this.spinner.hide();
          this.toaster.error('Erro ao tentar salvar evento', 'Erro');
        },
        () => this.spinner.hide(),
      ); */

    }

  }

}
