using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contracts
{
    public interface ILotePersist
    {
        /// <summary>
        /// Método get que retornará uma lista de lote por eventoId
        /// </summary>
        /// <param name="eventoId">Código chave da tabela Evento</param>
        /// <returns>Array de lotes</returns>
        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);
        /// <summary>
        /// Método get que retornará apenas 1 lote
        /// </summary>
        /// <param name="eventoId">Código chave da tabela Evento</param>
        /// <param name="loteId">Código chave da tabela lote</param>
        /// <returns>Apenas um lote</returns>
        Task<Lote> GetLoteByIdsAsync(int eventoId, int loteId);

    }
}