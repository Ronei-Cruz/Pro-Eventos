using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contracts;
using ProEventos.Persistence.Contexts;

namespace ProEventos.Persistence
{
    public class LotePersist : ILotePersist
    {
        private readonly ProEventosContext _context;
        public LotePersist(ProEventosContext context)
        {
            _context = context;
        }

        public Task<Lote> GetLoteByIdsAsync(int eventoId, int loteId)
        {
            IQueryable<Lote> query = _context.Lotes;
            query = query.AsNoTracking()
                         .Where(lote => lote.EventoId == eventoId && lote.Id == loteId);

            return query.FirstOrDefaultAsync();
        }

        public Task<Lote[]> GetLotesByEventoIdAsync(int eventoId)
        {
            IQueryable<Lote> query = _context.Lotes;
            query = query.AsNoTracking()
                         .Where(lote => lote.EventoId == eventoId);

            return query.ToArrayAsync();
        }
    }
}