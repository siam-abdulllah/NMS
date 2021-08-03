using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NMS_API.Dtos.CurrencyRateDtos;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Models;
using NMS_API.Services.Interfaces;

namespace NMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CurrencyRateController : ControllerBase
    {
        private readonly ICurrencyRateRepository _currencyRateRepository;

        public CurrencyRateController(ICurrencyRateRepository currencyRateRepository)
        {
            _currencyRateRepository = currencyRateRepository;
        }

        // GET: api/GetAllCurrencyRates
        [Authorize(Roles = "Admin, SA")]
        [HttpPost("GetAllCurrencyRates")]
        public async Task<PagedResultDto<GetCurrencyRateViewDto>> GetAllCurrencyRates(GetAllInputFilter input)
        {
            var result = await _currencyRateRepository.GetAllCurrencyRates(input);
            return result;
        }

        // GET: api/GetCurrencyRate/5
        [Authorize(Roles = "Admin,SA")]
        [HttpGet("GetCurrencyRate/{id}")]
        public async Task<ActionResult<GetCurrencyRateViewDto>> GetCurrencyRate(int id)
        {
            var currencyRate = await _currencyRateRepository.GetCurrencyRate(id);

            if (currencyRate == null)
            {
                return NotFound();
            }

            return currencyRate;
        }

        // POST: api/CreateCurrencyRate
        [Authorize(Roles = "Admin,SA")]
        [HttpPost("CreateCurrencyRate")]
        public async Task<ActionResult<CurrencyRate>> CreateCurrencyRate(CreateCurrencyDto createCurrencyDto)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            var res = await _currencyRateRepository.IsCurrencyRateExists(createCurrencyDto.Currency);
            if (!res)
            {
                return BadRequest("Currency already exist");
            }
            var createCurrency = await _currencyRateRepository.CreateCurrencyRate(createCurrencyDto,userId);
            return createCurrency;
        }

        // PUT: api/EditCurrencyRate/5
        [Authorize(Roles = "Admin,SA")]
        [HttpPut("EditCurrencyRate/{id}")]
        public async Task<ActionResult<GetCurrencyRateViewDto>> EditCurrencyRate(int id, GetCurrencyRateForEditDto editOutput)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            var currencyRate = await _currencyRateRepository.EditCurrencyRate(id, editOutput, userId);

            return currencyRate;
        }

        // DELETE: api/DeleteCurrencyRate/5
        [Authorize(Roles = "Admin,SA")]
        [HttpDelete("DeleteCurrencyRate/{id}")]
        public async Task<ActionResult<CurrencyRate>> DeleteCurrencyRate(int id)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            var currencyRate = await _currencyRateRepository.DeleteCurrencyRate(id, userId);
            return currencyRate;
        }
    }
}