using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using NMS_API.Dtos.CurrencyRateDtos;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Models;

namespace NMS_API.Services.Interfaces
{
    public interface ICurrencyRateRepository
    {
        Task<PagedResultDto<GetCurrencyRateViewDto>> GetAllCurrencyRates(GetAllInputFilter input);
        Task<GetCurrencyRateViewDto> GetCurrencyRate(int id);
        Task<GetCurrencyRateViewDto> EditCurrencyRate(int id, GetCurrencyRateForEditDto editOutput, int? userId);
        Task<CurrencyRate> CreateCurrencyRate(CreateCurrencyDto createCurrencyDto, int? userId);
        Task<CurrencyRate> DeleteCurrencyRate(int id, int? userId);
        Task<bool> IsCurrencyRateExists(string name);
    }
}
