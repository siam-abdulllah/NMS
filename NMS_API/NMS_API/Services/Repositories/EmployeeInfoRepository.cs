using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Application.Services.Dto;
using Abp.Linq.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NMS_API.Data;
using NMS_API.Dtos.EmployeeInfoDtos;
using NMS_API.Models;
using NMS_API.Services.Interfaces;
using System.Linq.Dynamic.Core;

namespace NMS_API.Services.Repositories
{
    public class EmployeeInfoRepository : IEmployeeInfoRepository
    {

        private readonly NmsDataContext _context;

        public EmployeeInfoRepository(NmsDataContext context)
        {
            _context = context;
        }
      
        public async Task<PagedResultDto<GetEmployeeForViewDto>> GetEmployeeInfos(GetAllInputFilter input)
        {
           
            var employeeInfo = (from ul in _context.UserLogins
                                        join em in _context.EmployeeInfos on ul.Id equals em.UserId
                                        where( em.EmpName.Contains(input.Filter) || em.Email.Contains(input.Filter) || em.EmpCode.Contains(input.Filter) || em.Designation.Contains(input.Filter))

                                        select new GetEmployeeForViewDto
                                        {   Id=em.Id,
                                            UserId = ul.Id,
                                            Username = ul.Username,
                                            EmpName = em.EmpName,
                                            Email = em.Email,
                                            ContactNo = em.ContactNo,
                                            Designation = em.Designation,
                                            EmpCode = em.EmpCode

                                        });
            var totalCount = await employeeInfo.CountAsync();

            var results = await employeeInfo
                .OrderBy(input.Sorting ?? "e => e.Id desc")
                // .OrderByDescending(e => e.Id)
                //.OrderBy(input.Sorting ?? "employee.id desc ")
                .PageBy(input)
                .ToListAsync();
            
            return new PagedResultDto<GetEmployeeForViewDto>(
                totalCount,
                results
                );

        }
       
        public async Task<GetEmployeeForViewDto> GetEmployeeInfo(int id)
        {
            var employeeInfo = await (from ul in _context.UserLogins join em in _context.EmployeeInfos on ul.Id equals em.UserId
                                      where(em.Id ==id)
                                      select new GetEmployeeForViewDto
                                      {
                                          UserId = ul.Id,
                                          Username = ul.Username,
                                          EmpName=em.EmpName,
                                          Email = em.Email,
                                          ContactNo = em.ContactNo,
                                          Designation =em.Designation,
                                          EmpCode=em.EmpCode
                                         // Password = new System.Security.Cryptography.HMACSHA512(ul.PasswordHash),
                                          
                                      }).FirstOrDefaultAsync();

            return employeeInfo;
        }

        public async Task<GetEmployeeForViewDto> PutEmployeeInfo(int id, GetEmployeeForEditOutput editOutput)
        {
            EmployeeInfo emp = await _context.EmployeeInfos.FirstOrDefaultAsync(i => i.Id == id);
            if (emp != null)
            {
                emp.EmpName = editOutput.EmpName;
                emp.Email = editOutput.Email;
                emp.Designation = editOutput.Designation;
                emp.ContactNo = editOutput.ContactNo;

            }
            UserLogin userLogin = await _context.UserLogins.FirstOrDefaultAsync(x => x.Id == emp.UserId);
            if(userLogin != null)
            {
                userLogin.Username = editOutput.Username;
            }
            _context.UserLogins.Update(userLogin);
            _context.EmployeeInfos.Update(emp);
            await _context.SaveChangesAsync();
            var updatedEmployee =await GetEmployeeInfo(emp.Id);
            return updatedEmployee;

        }
        public async Task<UserLogin> CreateUserLogin(UserLogin userLogin, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);
            userLogin.PasswordHash = passwordHash;
            userLogin.PasswordSalt = passwordSalt;
            await _context.UserLogins.AddAsync(userLogin);
            await _context.SaveChangesAsync();
            return userLogin;
        }
        public void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        public async Task<EmployeeInfo> PostEmployeeInfo(GetEmployeeForEditOutput getEmployeeForEditOutput, int id)
        {
            EmployeeInfo employeeInfo = new EmployeeInfo
            {
                EmpCode = "EMP"+id,
                EmpName = getEmployeeForEditOutput.EmpName,
                Designation = getEmployeeForEditOutput.Designation,
                ContactNo = getEmployeeForEditOutput.ContactNo,
                Email = getEmployeeForEditOutput.Email,
                UserId = id
            };
            await _context.EmployeeInfos.AddAsync(employeeInfo);
            await _context.SaveChangesAsync();


            return employeeInfo;
        }

        public async Task<EmployeeInfo> DeleteEmployeeInfo(int id)
        {
            var emp = await _context.EmployeeInfos.FirstOrDefaultAsync(e => e.Id == id);
            var user = await _context.UserLogins.FirstOrDefaultAsync(x => x.Id == emp.UserId);

            _context.EmployeeInfos.Remove(emp);
            _context.UserLogins.Remove(user);
            await _context.SaveChangesAsync();
            return emp;
        }

        public async Task<bool> IsEmployeeEmailExists(string email)
        {
            if (await _context.EmployeeInfos.AnyAsync(x => x.Email == email))
                return false;
            return true;
        }

        public async Task<bool> IsEmployeeUserNameExists(string username)
        {
            if (await _context.UserLogins.AnyAsync(x => x.Username == username))
                return false;
            return true;
        }
        public async Task<bool> IsEmployeeExists(int id)
        {
            if (await _context.EmployeeInfos.AnyAsync(x => x.Id == id))
                return false;
            return true;
        }

    }
}
