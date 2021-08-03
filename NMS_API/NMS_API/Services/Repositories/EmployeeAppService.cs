using NMS_API.Data;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using Abp.Linq.Extensions;
using Abp.ObjectMapping;
using Abp.Application.Services.Dto;
using Microsoft.AspNetCore.Mvc;
using Abp.Domain.Repositories;
using Abp.Application.Services;
using NMS_API.Services.Interfaces;

namespace NMS_API.Services.Repositories
{

    public class EmployeeAppService : ApplicationService, IEmployeeInfoAppService 
    {
        private readonly NmsDataContext _nmsDataContext;
        private readonly IObjectMapper _objectMapper;
        private readonly IRepository<EmployeeInfo,int> _employeeRepository;
        private readonly IRepository<UserLogin, int> _userRepository;
        public EmployeeAppService(
            NmsDataContext nmsDataContext, 
            IRepository<EmployeeInfo, int> employeeRepository,
            IRepository<UserLogin, int> userRepository,
            IObjectMapper objectMapper
            )
        {
            _nmsDataContext = nmsDataContext;
            _employeeRepository = employeeRepository;
            _userRepository = userRepository;
            _objectMapper = objectMapper;
        }

       // [HttpPost("RegisterImporter")]
        public async Task CreateOrEdit(CreateOrEditEmployeeDto input)
        {
            if (input.Id == null)
            {
                await Create(input);
            }
            else
            {
                await Update(input);
            }

        }
        private async Task Create(CreateOrEditEmployeeDto input)
        {
            var employee = _objectMapper.Map<EmployeeInfo>(input);

            await _employeeRepository.InsertAsync(employee);
        }

        private async Task Update(CreateOrEditEmployeeDto input)
        {
            var employee = await _employeeRepository.FirstOrDefaultAsync((int)input.Id);
            _objectMapper.Map(input, employee);
        }

        public async Task Delete(EntityDto<int> input)
        {
            await _employeeRepository.DeleteAsync(input.Id);
        }

        public async Task<PagedResultDto<GetEmployeeViewDto>> GetAll(GetAllEmployeesInput input)
        {
            var filteredEmployees = _employeeRepository.GetAll()
                .Where(e => false || e.EmpName.Contains(input.Filter) || e.Email.Contains(input.Filter) || e.EmpCode.Contains(input.Filter) || e.Designation.Contains(input.Filter));

            var query = (from o in filteredEmployees
                         join o1 in _userRepository.GetAll() on o.UserId equals o1.Id into j1
                         from s1 in j1.DefaultIfEmpty()
                         select new GetEmployeeViewDto()
                         {
                             Employee = _objectMapper.Map<EmployeeInfoDto>(o),
                             Username = s1 == null ? "" : s1.Username.ToString(),
                             Password = s1 == null ? "" : s1.PasswordHash.ToString()

                         });
            var totalCount = await query.CountAsync();

            var employees = await query
                .OrderBy(input.Sorting ?? "employee.id asc")
                .PageBy(input)
                .ToListAsync();
            return new PagedResultDto<GetEmployeeViewDto>(
               totalCount,
               employees
           );
        }

        //public async Task<GetEmployeeForEditOutput> GetEmployeeForEdit(EntityDto<int> input)
        //{
        //    var employee = await _employeeRepository.FirstOrDefaultAsync(input.Id);

        //    var output = new GetEmployeeForEditOutput { Employee = _objectMapper.Map<CreateOrEditEmployeeDto>(employee) };

        //    if (output.Employee.UserId != null)
        //    {
        //        var user = await _userRepository.FirstOrDefaultAsync((int)output.Employee.UserId);
        //        output.Username = user.Username.ToString();
        //    }
        //    return output;
        //}

        public async Task<GetEmployeeViewDto> GetEmployeeForView(int id)
        {
            var employee = await _employeeRepository.GetAsync(id);

            var output = new GetEmployeeViewDto { Employee = _objectMapper.Map<EmployeeInfoDto>(employee) };

            if (output.Employee.UserId != null)
            {
                var user = await _userRepository.FirstOrDefaultAsync((int)output.Employee.UserId);
                output.Username = user.Username.ToString();
                //output.Password = user.PasswordHash.ToString();
            }
            return output;

        }
    }
}
