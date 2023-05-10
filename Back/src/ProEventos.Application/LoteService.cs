using System;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using ProEventos.Application.Contracts;
using ProEventos.Application.Dtos;
using ProEventos.Domain;
using ProEventos.Persistence.Contracts;

namespace ProEventos.Application
{
    public class LoteService : ILoteService
    {
        private readonly IGeralPersist _geralPersist;
        private readonly ILotePersist _lotePersist;
        private readonly IMapper _mapper;

        public LoteService(IGeralPersist geralPersist, ILotePersist lotePersist, IMapper mapper)
        {
            _geralPersist = geralPersist;
            _lotePersist = lotePersist;
            _mapper = mapper;
        }

        public async Task<LoteDTO[]> SaveLotes(int eventoId, LoteDTO[] models)
        {
            try
            {
                var lotes = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                if(lotes == null) return null;

                foreach (var model in models)
                {
                    if (model.Id == 0)
                    {
                        await AddLote(eventoId, model);
                    }
                    else
                    {
                        var lote = lotes.FirstOrDefault(lote => lote.Id == model.Id);
                        model.EventoId = eventoId;
                        // _mapper.Map(models, lote);
                        if (lote != null)
                        {
                            lote.Nome = model.Nome;
                            lote.Preco = model.Preco;
                            lote.DataInicio = Convert.ToDateTime(model.DataInicio);
                            lote.DataFim = Convert.ToDateTime(model.DataFim);
                            lote.Quantidade = model.Quantidade;
                            lote.EventoId = eventoId;

                            _geralPersist.Update<Lote>(lote);
                            await _geralPersist.SaveChangesAsync();
                        }

                        // RETIRADA DO MAPPER POR QUESTÕES DE ERROR  'Missing type map configuration or unsupported mapping.'

                        /* _mapper.Map(models, lote, typeof(LoteDTO), typeof(Lote));
                         _geralPersist.Update<Lote>(lote);
                        await _geralPersist.SaveChangesAsync(); */
                    }
                }

                var loteRetorno = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                return _mapper.Map<LoteDTO[]>(loteRetorno);

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDTO> GetLoteByIdsAsync(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId, loteId);
                if (lote == null) return null;

                var resultado = _mapper.Map<LoteDTO>(lote);
                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<LoteDTO[]> GetLotesByEventoIdAsync(int eventoId)
        {
            try
            {
                var lotes = await _lotePersist.GetLotesByEventoIdAsync(eventoId);
                if(lotes == null) return null;

                var resultado = _mapper.Map<LoteDTO[]>(lotes);

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<bool> DeleteLote(int eventoId, int loteId)
        {
            try
            {
                var lote = await _lotePersist.GetLoteByIdsAsync(eventoId, loteId);
                if(lote == null) throw new Exception("Lote para delete não encontrado.");

                _geralPersist.Delete<Lote>(lote);
                return await _geralPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task AddLote(int eventoId, LoteDTO model)
        {
            try
            {
                var lote = _mapper.Map<Lote>(model);
                lote.EventoId = eventoId;

                _geralPersist.Add<Lote>(lote);

                await _geralPersist.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }
    }
}