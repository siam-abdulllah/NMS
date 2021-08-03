using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NMS_API.Data;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Models;
using NMS_API.Services.Interfaces;

namespace NMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeInfoesController : ControllerBase
    {
        private readonly IEmployeeInfoRepository _employeeInfoRepository;

        public EmployeeInfoesController(IEmployeeInfoRepository employeeInfoRepository)
        {
            _employeeInfoRepository = employeeInfoRepository;
        }

        // GET: api/EmployeeInfoes
        [HttpPost("GetEmployeeInfos")]
        public async Task<PagedResultDto<GetEmployeeForViewDto>> GetEmployeeInfos(GetAllInputFilter input)
        {

            var result= await _employeeInfoRepository.GetEmployeeInfos(input);
            return result;

        }

        // GET: api/EmployeeInfoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GetEmployeeForViewDto>> GetEmployeeInfo(int id)
        {
            var employeeInfo = await _employeeInfoRepository.GetEmployeeInfo(id);

            if (employeeInfo == null)
            {
                return NotFound();
            }

            return employeeInfo;
        }

        // PUT: api/EmployeeInfoes/5
        [HttpPut("{id}")]
        public async Task<ActionResult<GetEmployeeForViewDto>> PutEmployeeInfo(int id, GetEmployeeForEditOutput editOutput)
        {
           
            if( _employeeInfoRepository.IsEmployeeExists(id)==null)
            {
                return BadRequest();
            }

            var empInfo=await _employeeInfoRepository.PutEmployeeInfo(id, editOutput);

            return empInfo;
        }

        // POST: api/EmployeeInfoes
        [HttpPost("PostEmployeeInfo")]
        public async Task<ActionResult<EmployeeInfo>> PostEmployeeInfo(GetEmployeeForEditOutput getEmployeeForEditOutput)
        {
            getEmployeeForEditOutput.Username = getEmployeeForEditOutput.Username.ToLower();
            getEmployeeForEditOutput.Email = getEmployeeForEditOutput.Email.ToLower();
            if (!await _employeeInfoRepository.IsEmployeeUserNameExists(getEmployeeForEditOutput.Username))
                return BadRequest("Username is Already Exist");
            if (!await _employeeInfoRepository.IsEmployeeEmailExists(getEmployeeForEditOutput.Email))
                return BadRequest("Email is Already Exist");
            var userLoginToCreate = new UserLogin
            {
                Username = getEmployeeForEditOutput.Username,
                UserType = "E",
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };
            var createdUserLogin = await _employeeInfoRepository.CreateUserLogin(userLoginToCreate, getEmployeeForEditOutput.Password);
            EmployeeInfo employee = null;
            if (createdUserLogin.Id > 0)
            {
                employee = await _employeeInfoRepository.PostEmployeeInfo(getEmployeeForEditOutput, createdUserLogin.Id);
            }
            return employee;
        }

        // DELETE: api/EmployeeInfoes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<EmployeeInfo>> DeleteEmployeeInfo(int id)
        {
            var employeeInfo = await _employeeInfoRepository.DeleteEmployeeInfo(id);

            return employeeInfo;
        }

    }
}
