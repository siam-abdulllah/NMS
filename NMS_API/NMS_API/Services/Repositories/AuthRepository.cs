using Microsoft.EntityFrameworkCore;
using NMS_API.Data;
using NMS_API.Dtos;
using NMS_API.Dtos.AuthDto;
using NMS_API.Models;
using NMS_API.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly NmsDataContext _nmsDataContext;
        public AuthRepository(NmsDataContext nmsDataContext)
        {
            _nmsDataContext = nmsDataContext;
        }

        public async Task<UserLogin> CreateUserLogin(UserLogin userLogin, string password)
        {
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);
            userLogin.PasswordHash = passwordHash;
            userLogin.PasswordSalt = passwordSalt;
            await _nmsDataContext.UserLogins.AddAsync(userLogin);
            await _nmsDataContext.SaveChangesAsync();
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

        public async Task<ImporterInfo> Register(ImporterInfoDto importerInfoDto, int id)
        {
            ImporterInfo importerInfo = new ImporterInfo
            {
                OrgName = importerInfoDto.OrgName,
                ContactName = importerInfoDto.ContactName,
                Position = importerInfoDto.Position,
                ContactNo = importerInfoDto.ContactNo,
                Email = importerInfoDto.Email.ToLower(),
                Division = importerInfoDto.Division,
                District = importerInfoDto.District,
                Upazila = importerInfoDto.Upazila,
                Address = importerInfoDto.Address,
                DlsLicenseType = importerInfoDto.DlsLicenseType,
                DlsLicenseNo = importerInfoDto.DlsLicenseNo,
                //DlsLicenseScan = importerInfoDto.DlsLicenseScan,
                NidNo = importerInfoDto.NidNo,
                //NidScan = importerInfoDto.NidScan,
                //IrcScan = importerInfoDto.IrcScan,
                UserId = id
            };
            await _nmsDataContext.ImporterInfos.AddAsync(importerInfo);
            bool result = await _nmsDataContext.SaveChangesAsync() > 0;
            UserRoleConf userRoleConf = null;
            if (result)
            {
                userRoleConf = await AssignImporterToRole(importerInfo.UserId);
            }
            // ********need to be delete the user for Assign ImporterTRole failed ****************** ///
            return importerInfo;
        }
        private async Task<UserRoleConf> AssignImporterToRole(int userId)
        {
            var importerRole = await _nmsDataContext.RoleInfos.FirstOrDefaultAsync(x => x.Name.ToLower() == "importer");
            UserRoleConf userRoleConf = null;
            if (userId > 0)
            {
                userRoleConf = new UserRoleConf
                {

                    UserId = userId,
                    RoleId = importerRole.Id
                };
                await _nmsDataContext.UserRoleConfs.AddAsync(userRoleConf);
                _nmsDataContext.SaveChanges();
            }
            return userRoleConf;
        }

        public async Task<bool> UserExist(string username)
        {
            if (await _nmsDataContext.UserLogins.AnyAsync(x => x.Username == username))
                return false;
            return true;
        }

        public async Task<ImporterInfo> UpdateImporterFilePath(int id, string[] Arr)
        {
            ImporterInfo targetedImporter = await _nmsDataContext.ImporterInfos.FirstOrDefaultAsync(i => i.Id == id);

            targetedImporter.DlsLicenseScan = Arr[0] == null ? null : Arr[0].Replace("\\", "/");
            targetedImporter.NidScan = Arr[1] == null ? null : Arr[1].Replace("\\", "/");
            targetedImporter.IrcScan = Arr[2] == null ? null : Arr[2].Replace("\\", "/");

            if (id > 0 && targetedImporter != null)
            {
                _nmsDataContext.ImporterInfos.Attach(targetedImporter);
                await _nmsDataContext.SaveChangesAsync();
            }
            return targetedImporter;
        }

        public async Task<UserLogin> Login(string username, string password)
        {
            var user = await _nmsDataContext.UserLogins.FirstOrDefaultAsync(x => x.Username == username);
            if (user == null)
                return null;
            if (!VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;
            return user;
        }
        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != passwordHash[i])
                        return false;
                }
            }
            return true;
        }

        public async Task<UserCredential> GetUserCredential(int id, string userType)
        {
            UserCredential userCred = null;
            if (userType == "I")
            {
                userCred = await (from ul in _nmsDataContext.UserLogins
                                  join im in _nmsDataContext.ImporterInfos on ul.Id equals im.UserId
                                  join urc in _nmsDataContext.UserRoleConfs on ul.Id equals urc.UserId
                                  join ri in _nmsDataContext.RoleInfos on urc.RoleId equals ri.Id
                                  where (ul.Id == id)
                                  select new UserCredential
                                  {
                                      UserLoginId = ul.Id,
                                      Username = ul.Username,
                                      ContactName = im.ContactName,
                                      Email = im.Email,
                                      Position = im.Position,
                                      Role = ri.Name,
                                      OrgName = im.OrgName,
                                      ImpOrEmpId = im.Id
                                  }).FirstOrDefaultAsync();
            }
            else if (userType == "E")
            {
                userCred = await (from ul in _nmsDataContext.UserLogins
                                  join emp in _nmsDataContext.EmployeeInfos on ul.Id equals emp.UserId
                                  join urc in _nmsDataContext.UserRoleConfs on ul.Id equals urc.UserId
                                  join ri in _nmsDataContext.RoleInfos on urc.RoleId equals ri.Id
                                  where (ul.Id == id)
                                  select new UserCredential
                                  {
                                      UserLoginId = ul.Id,
                                      Username = ul.Username,
                                      Email = emp.Email,
                                      ContactName = emp.EmpName,
                                      Role = ri.Name,
                                      OrgName = "Department of Livestock Services(DLS)",
                                      Position = emp.Designation,
                                      ImpOrEmpId = emp.Id
                                  }).FirstOrDefaultAsync();
            }
            return userCred;
        }

        public async Task<ImporterInfo> UpdateImporterInfo(ImporterInfo importerInfo)
        {
            try
            {
                var importer = await _nmsDataContext.ImporterInfos.FirstOrDefaultAsync(x => x.Id == importerInfo.Id);
                importer.ContactName = importerInfo.ContactName;
                importer.Position = importerInfo.Position;
                importer.ContactNo = importerInfo.ContactNo;
                importer.Email = importerInfo.Email;
                importer.NidNo = importerInfo.NidNo;
                _nmsDataContext.ImporterInfos.Attach(importer);
                await _nmsDataContext.SaveChangesAsync();
                var userLogin = await _nmsDataContext.UserLogins.FirstOrDefaultAsync(x => x.Id == importer.UserId);
                userLogin.Username = importerInfo.UserLogin.Username;
                _nmsDataContext.UserLogins.Attach(userLogin);
                await _nmsDataContext.SaveChangesAsync();
                var updatedImporter = await _nmsDataContext.ImporterInfos.FirstOrDefaultAsync(x => x.Id == importerInfo.Id);
                return updatedImporter;
            }catch(Exception ex)
            {
                throw ex;
            }
  
        }

        public async Task<ImporterInfo> GetImporter(int id)
        {
            var importer = await _nmsDataContext.ImporterInfos
                .Include(x => x.UserLogin)
                .FirstOrDefaultAsync(x => x.Id == id);
            return importer;
        }

        public async Task<ImporterInfo> UpdateNidFilePath(int id, string[] Arr)
        {
            ImporterInfo targetedImporter = await _nmsDataContext.ImporterInfos.FirstOrDefaultAsync(x => x.Id == id);
            targetedImporter.NidScan = Arr[0] == null ? null : Arr[0].Replace("\\", "/");
            if (id > 0 && targetedImporter != null)
            {
                _nmsDataContext.ImporterInfos.Attach(targetedImporter);
                await _nmsDataContext.SaveChangesAsync();
            }
            return targetedImporter;
        }

        public async Task<bool> VerifyCurrentPassword(VerifyCrntPassDto verifyCrntPassDto)
        {
            ImporterInfo importer = await _nmsDataContext.ImporterInfos
                .Include(x => x.UserLogin)
                .FirstOrDefaultAsync(x => x.Id == verifyCrntPassDto.ImporterId);
            if (VerifyPasswordHash(verifyCrntPassDto.CurrentPassword, importer.UserLogin.PasswordHash, importer.UserLogin.PasswordSalt))
                return true;
            return false;
        }

        public async Task<bool> VerifyCurrentPasswordEmp(VerifyCrntPassDto verifyCrntPassDto)
        {
            EmployeeInfo employeeInfo = await _nmsDataContext.EmployeeInfos
                .Include(x => x.UserLogin)
                .FirstOrDefaultAsync(x => x.Id == verifyCrntPassDto.EmployeeId);
            if (VerifyPasswordHash(verifyCrntPassDto.CurrentPassword, employeeInfo.UserLogin.PasswordHash, employeeInfo.UserLogin.PasswordSalt))
                return true;
            return false;
        }

        public async Task<bool> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            ImporterInfo importer = await _nmsDataContext.ImporterInfos.FirstOrDefaultAsync(x => x.Id == changePasswordDto.ImporterId);
            UserLogin user = await _nmsDataContext.UserLogins.FirstOrDefaultAsync(x => x.Id == importer.UserId);
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(changePasswordDto.NewPassword, out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            _nmsDataContext.UserLogins.Attach(user);
            var res = await _nmsDataContext.SaveChangesAsync() > 0;
            return res;
        }
        public async Task<bool> ChangePasswordEmp(ChangePasswordDto changePasswordDto)
        {
            EmployeeInfo employeeInfo = await _nmsDataContext.EmployeeInfos.FirstOrDefaultAsync(x => x.Id == changePasswordDto.EmployeeId);
            UserLogin user = await _nmsDataContext.UserLogins.FirstOrDefaultAsync(x => x.Id == employeeInfo.UserId);
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(changePasswordDto.NewPassword, out passwordHash, out passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            _nmsDataContext.UserLogins.Attach(user);
            var res = await _nmsDataContext.SaveChangesAsync() > 0;
            return res;
        }
    }
}
