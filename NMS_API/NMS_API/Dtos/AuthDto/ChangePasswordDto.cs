﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NMS_API.Dtos.AuthDto
{
    public class ChangePasswordDto
    {
        public int ImporterId { get; set; }
        public int EmployeeId { get; set; }
        public string NewPassword { get; set; }
    }
}