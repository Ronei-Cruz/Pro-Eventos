using System.Threading.Tasks;
using ProEventos.Application.Dtos;

namespace ProEventos.Application.Contracts
{
    public interface IEventoService
    {
        Task<EventoDTO> AddEventos(EventoDTO model);
        Task<EventoDTO> UpdateEvento(int eventoId, EventoDTO model);
        Task<bool> DeleteEvento(int eventoId);
        Task<EventoDTO[]> GetAllEventosAsync(bool includePalestrantes = false);
        Task<EventoDTO[]> GetAllEventosByTemaAsync(string tema, bool includePalestrantes = false);
        Task<EventoDTO> GetEventoByIdAsync(int EventoId, bool includePalestrantes = false);
    }
}