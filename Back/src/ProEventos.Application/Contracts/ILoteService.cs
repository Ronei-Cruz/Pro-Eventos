using System.Threading.Tasks;
using ProEventos.Application.Dtos;

namespace ProEventos.Application.Contracts
{
    public interface ILoteService
    {
        Task<LoteDTO[]> SaveLotes(int eventoId, LoteDTO[] models);
        Task<bool> DeleteLote(int eventoId, int loteId);
        Task<LoteDTO[]> GetLotesByEventoIdAsync(int eventoId);
        Task<LoteDTO> GetLoteByIdsAsync(int eventoId, int loteId);
    }
}