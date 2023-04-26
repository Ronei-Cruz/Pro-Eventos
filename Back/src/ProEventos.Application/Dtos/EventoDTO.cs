using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDTO
    {
        public int Id { get; set; }

        [Display(Name ="local")]
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        public string Local { get; set; }
        public string DataEvento { get; set; }

        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [StringLength(50, MinimumLength = 3, ErrorMessage ="O campo {0} tem intervalo de 3 a 50 caracteres.")]
        public string Tema { get; set; }

        [Display(Name = "Quantidade de Pessoas")]
        [Range(1,300, ErrorMessage ="{0} não pode ser menor que 1 e maior que 300.")]
        public int QtdPessoas { get; set; }

        [Display(Name = "imagem")]
        [Required(ErrorMessage = "O campo {0} é obrigatório")]
        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$", ErrorMessage = "Não é uma {0} válida. (gif, jpg, jpeg, bmp, png)")]
        public string ImageURL { get; set; }

        [Display(Name ="telefone")]
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        [Phone(ErrorMessage = "O campo {0} está com número inválido.")]
        public string Telefone { get; set; }

        [Display(Name = "e-mail")]
        [Required(ErrorMessage = "O campo {0} é obrigatório.")]
        [EmailAddress(ErrorMessage ="Precisa ser um {0} válido.")]
        public string Email { get; set; }
        public IEnumerable<LoteDTO> Lotes { get; set; }
        public IEnumerable<RedeSocialDTO> RedesSociais { get; set; }
        public IEnumerable<PalestranteDTO> Palestrante { get; set; }
    }
}