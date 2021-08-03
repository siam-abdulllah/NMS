using Abp.Application.Services.Dto;
using Microsoft.EntityFrameworkCore;
using NMS_API.Data;
using NMS_API.Dtos.CurrencyRateDtos;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Models;
using NMS_API.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;

namespace NMS_API.Services.Repositories
{
    public class CurrencyRateRepository : ICurrencyRateRepository
    {
        private readonly NmsDataContext _context;

        public CurrencyRateRepository(NmsDataContext context)
        {
            _context = context;
        }

        public async Task<CurrencyRate> CreateCurrencyRate(CreateCurrencyDto createCurrencyDto, int? userId)
        {
            CurrencyRate currencyRate = new CurrencyRate
            {
                Currency = createCurrencyDto.Currency,
                TickerIcon = createCurrencyDto.TickerIcon,
                ExchangeRate = createCurrencyDto.ExchangeRate,
                CreationTime= DateTime.Now,
                CreatorUserId = userId
            };
            await _context.CurrencyRates.AddAsync(currencyRate);
            await _context.SaveChangesAsync();
            return currencyRate;
        }

        public async Task<CurrencyRate> DeleteCurrencyRate(int id, int? userId)
        {
            var currencyRate = await _context.CurrencyRates.FirstOrDefaultAsync(e => e.Id == id);
            currencyRate.DeletionTime = DateTime.Now;
            currencyRate.IsDeleted = true;
            currencyRate.DeleterUserId = userId;
            _context.CurrencyRates.Update(currencyRate);
            await _context.SaveChangesAsync();
            return currencyRate;
        }

        public async Task<GetCurrencyRateViewDto> EditCurrencyRate(int id, GetCurrencyRateForEditDto editOutput, int? userId)
        {
            var dt = DateTime.Now;
            CurrencyRate currencyRate = await _context.CurrencyRates.FirstOrDefaultAsync(i => i.Id == id);
            if (currencyRate != null)
            {
                currencyRate.Currency = editOutput.Currency;
                currencyRate.TickerIcon = editOutput.TickerIcon;
                currencyRate.ExchangeRate = editOutput.ExchangeRate;
                 currencyRate.LastModificationTime = dt;
                 currencyRate.LastModifierUserId = userId;

            }
            _context.CurrencyRates.Update(currencyRate);
            await _context.SaveChangesAsync();
            var updatedCurrencyRate = await GetCurrencyRate(currencyRate.Id);
            return updatedCurrencyRate;
        }

        public async Task<PagedResultDto<GetCurrencyRateViewDto>> GetAllCurrencyRates(GetAllInputFilter input)
        {
            var currencyRate = (from c in _context.CurrencyRates
                                where c.IsDeleted ==false && (c.Currency.Contains(input.Filter) || c.TickerIcon.Contains(input.Filter))

                                select new GetCurrencyRateViewDto
                                {
                                    Id = c.Id,
                                    Currency = c.Currency,
                                    TickerIcon = c.TickerIcon,
                                    ExchangeRate = c.ExchangeRate,
                                    CreationTime = c.CreationTime,
                                    CreatorUserId = c.CreatorUserId,
                                    LastModificationTime = c.LastModificationTime,
                                    LastModifierUserId = c.LastModifierUserId

                                });
            var totalCount = await currencyRate.CountAsync();

            var results = await currencyRate
                .OrderBy(input.Sorting ?? "e => e.Id desc")
                .PageBy(input)
                .ToListAsync();

            return new PagedResultDto<GetCurrencyRateViewDto>(
                totalCount,
                results
                );
        }

        public async Task<GetCurrencyRateViewDto> GetCurrencyRate(int id)
        {
            var currencyRate = await (from c in _context.CurrencyRates
                                      where (c.Id == id)

                                      select new GetCurrencyRateViewDto
                                      {
                                          Id = c.Id,
                                          Currency = c.Currency,
                                          TickerIcon = c.TickerIcon,
                                          ExchangeRate = c.ExchangeRate,
                                          CreationTime = c.CreationTime,
                                          CreatorUserId = c.CreatorUserId,
                                          LastModificationTime = c.LastModificationTime,
                                          LastModifierUserId = c.LastModifierUserId
                                      }).FirstOrDefaultAsync();

            return currencyRate;
        }
        public async Task<bool> IsCurrencyRateExists(string name)
        {
            if (await _context.CurrencyRates.AnyAsync(x => x.Currency.ToLower() == name.ToLower()))
                return false;
            return true;
        }
    }
}
