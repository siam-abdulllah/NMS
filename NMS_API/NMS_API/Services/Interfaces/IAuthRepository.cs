using NMS_API.Dtos;
using NMS_API.Dtos.AuthDto;
using NMS_API.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Services.Interfaces
{
    public interface IAuthRepository
    {
        Task<ImporterInfo> Register(ImporterInfoDto importerInfoDto,int id);
        Task<bool> UserExist(string username);
        Task<UserLogin> CreateUserLogin(UserLogin userLogin, string password);
        Task<ImporterInfo> UpdateImporterFilePath(int id, string[] Arr);
        Task<UserLogin> Login(string username, string password);
        Task<UserCredential> GetUserCredential(int id, string userType);
        Task<ImporterInfo> UpdateImporterInfo(ImporterInfo importerInfo);
        Task<ImporterInfo> GetImporter(int id);
        Task<ImporterInfo> UpdateNidFilePath(int id, string[] Arr);
        Task<bool> VerifyCurrentPassword(VerifyCrntPassDto verifyCrntPassDto);
        Task<bool> VerifyCurrentPasswordEmp(VerifyCrntPassDto verifyCrntPassDto);
        Task<bool> ChangePassword(ChangePasswordDto changePasswordDto);
        Task<bool> ChangePasswordEmp(ChangePasswordDto changePasswordDto);
    }
}
