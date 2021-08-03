using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NMS_API.Data;
using NMS_API.Models;
using NMS_API.Services.Interfaces;

namespace NMS_API.Services.Repositories
{
    public class CurrencyRepository:ICurrencyRepository
    {
        private readonly NmsDataContext _context;
        public CurrencyRepository(NmsDataContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CurrencyRate>> Get()
        {
            var currencies = await _context.CurrencyRates.Where(x => x.IsDeleted == false).ToListAsync();
            return currencies;
        }
    }
}
