using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NMS_API.Dtos;
using NMS_API.Dtos.AuthDto;
using NMS_API.Models;
using NMS_API.Services.Interfaces;

namespace NMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IConfiguration _configuration;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IAuthRepository _authRepository;
        public AuthController(IAuthRepository importerRegRepository,
            IHostingEnvironment hostingEnvironment,
            IConfiguration configuration)
        {
            _configuration = configuration;
            _hostingEnvironment = hostingEnvironment;
            _authRepository = importerRegRepository;
        }
        [HttpPost("IsUsernameAvailable")]
        public async Task<ActionResult<bool>> IsUsernameAvailable(UsernameDto usernameDto)
        {
            bool res = await _authRepository.UserExist(usernameDto.Username);
            if (!res)
                return false;
            return true;
        }

        [HttpPost("RegisterImporter")]
        public async Task<ActionResult<ImporterInfo>> RegisterImporter(ImporterInfoDto importerInfoDto)
        {
            importerInfoDto.Username = importerInfoDto.Username.ToLower();
            if (!await _authRepository.UserExist(importerInfoDto.Username))
                return BadRequest("Username is Already Exist");

            var userLoginToCreate = new UserLogin
            {
                Username = importerInfoDto.Username,
                UserType = "I",
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };
            var createdUserLogin = await _authRepository.CreateUserLogin(userLoginToCreate, importerInfoDto.Password);
            ImporterInfo importer = null;
            if (createdUserLogin.Id > 0)
            {
                importer = await _authRepository.Register(importerInfoDto, createdUserLogin.Id);
            }
            return importer;
        }
        [HttpPost]
        [Route("UploadImporterFile/{id}")]
        public async Task<ActionResult<ImporterInfo>> UploadImporterFile(int id)
        {
            try
            {
                string[] importerFilePathArr = new string[3];
                for (int i = 0; i < Request.Form.Files.Count; i++)
                {
                    var v = Request.Form;
                    var file = Request.Form.Files[i];
                    var folderName = Path.Combine("Resources", "ImporterInfoDoc");
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    if (file.Length > 0)
                    {
                        // var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                        var gid = Guid.NewGuid();
                        var fileName = gid + ".pdf";
                        var fullPath = Path.Combine(folderName, fileName);
                        var dbPath = Path.Combine(fileName);
                        importerFilePathArr[i] = dbPath;
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                    }
                }
                ImporterInfo updatedImporter = await _authRepository.UpdateImporterFilePath(id, importerFilePathArr);
                return updatedImporter;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            try
            {
                var user = await _authRepository.Login(userForLoginDto.Username, userForLoginDto.Password);
                if (user == null)
                    return Unauthorized();
                UserCredential userCredentials = await _authRepository.GetUserCredential(user.Id, user.UserType);
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier,userCredentials.UserLoginId.ToString()),
                    new Claim(ClaimTypes.Name, userCredentials.ContactName),
                    new Claim(ClaimTypes.Email, userCredentials.Position),
                    new Claim(ClaimTypes.Role, userCredentials.Role),
                    new Claim(ClaimTypes.Surname, userCredentials.OrgName),
                    new Claim(ClaimTypes.SerialNumber, userCredentials.ImpOrEmpId.ToString())
                };
                var key = new SymmetricSecurityKey(Encoding.UTF8
                                .GetBytes(_configuration.GetSection("AppSettings:Token").Value));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = DateTime.Now.AddDays(1),
                    SigningCredentials = creds
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);
                return Ok(new
                {
                    token = tokenHandler.WriteToken(token)
                });
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [Authorize(Roles ="Importer")]
        [HttpPost("UpdateImporterInfo")]
        public async Task<ActionResult<ImporterInfo>> UpdateImporterInfo(ImporterInfo importerInfo)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            if (importerInfo.Id != userId)
                return BadRequest("UnAuthorized Access");
            var importer = await _authRepository.GetImporter(importerInfo.Id);
            ImporterInfo imp = null;
            if(importer.UserLogin.Username == importerInfo.UserLogin.Username)
            {
                imp = await _authRepository.UpdateImporterInfo(importerInfo);
            }
            else
            {
                if(!await _authRepository.UserExist(importerInfo.UserLogin.Username))
                {
                    return BadRequest("Username is not available");
                }
                else
                {
                    imp = await _authRepository.UpdateImporterInfo(importerInfo);
                }
            }
            return imp;
        }
        [Authorize(Roles ="Importer")]
        [HttpPost]
        [Route("UpdateNidFile/{id}")]
        public async Task<ActionResult<ImporterInfo>> UpdateNidFile(int id)
        {
            try
            {
                string[] nidFilePathArr = new string[1];
                if (Request.Form.Files.Count > 0)
                {
                    var v = Request.Form;
                    var file = Request.Form.Files[0];
                    var folderName = Path.Combine("Resources", "ImporterInfoDoc");
                    var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                    if (file.Length > 0)
                    {
                        var gid = Guid.NewGuid();
                        var fileName = gid + ".pdf";
                        var fullPath = Path.Combine(folderName, fileName);
                        var dbPath = fileName;
                        nidFilePathArr[0] = dbPath;
                        using (var stream = new FileStream(fullPath, FileMode.Create))
                        {
                            file.CopyTo(stream);
                        }
                    }
                }
                ImporterInfo updatedImporter = await _authRepository.UpdateNidFilePath(id, nidFilePathArr);
                return updatedImporter;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        [Authorize(Roles = "Importer")]
        [HttpPost("VerifyCurrentPassword")]
        public async Task<ActionResult<bool>> VerifyCurrentPassword(VerifyCrntPassDto verifyCrntPassDto)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            if (verifyCrntPassDto.ImporterId != userId)
                return BadRequest("UnAuthorized Access");
            var res = await _authRepository.VerifyCurrentPassword(verifyCrntPassDto);
            return res;
        }
        [Authorize(Roles = "Admin, SA")]
        [HttpPost("VerifyCurrentPasswordEmployee")]
        public async Task<ActionResult<bool>> VerifyCurrentPasswordEmployee(VerifyCrntPassDto verifyCrntPassDto)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            if (verifyCrntPassDto.EmployeeId != userId)
                return BadRequest("UnAuthorized Access");
            var res = await _authRepository.VerifyCurrentPasswordEmp(verifyCrntPassDto);
            return res;
        }
        [Authorize(Roles = "Importer")]
        [HttpPost("ChangePassword")]
        public async Task<ActionResult<bool>> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            if (changePasswordDto.ImporterId != userId)
                return BadRequest("UnAuthorized Access");
            var res = await _authRepository.ChangePassword(changePasswordDto);
            return res;
        }
        [Authorize(Roles = "Admin, SA")]
        [HttpPost("ChangePasswordEmployee")]
        public async Task<ActionResult<bool>> ChangePasswordEmployee(ChangePasswordDto changePasswordDto)
        {
            var userId = Convert.ToInt32(User.FindFirst(ClaimTypes.SerialNumber).Value);
            if (changePasswordDto.EmployeeId != userId)
                return BadRequest("UnAuthorized Access");
            var res = await _authRepository.ChangePasswordEmp(changePasswordDto);
            return res;
        }
        [Authorize(Roles = "Admin, SA")]
        [HttpPost("ChangePasswordAdminSide")]
        public async Task<ActionResult<bool>> ChangePasswordAdminSide(ChangePasswordDto changePasswordDto)
        {
            var res = await _authRepository.ChangePassword(changePasswordDto);
            return res;
        }
        [Authorize(Roles = "Admin, SA")]
        [HttpPost("ChangePasswordAdminSideEmployee")]
        public async Task<ActionResult<bool>> ChangePasswordAdminSideEmployee(ChangePasswordDto changePasswordDto)
        {
            var res = await _authRepository.ChangePasswordEmp(changePasswordDto);
            return res;
        }

    }
}