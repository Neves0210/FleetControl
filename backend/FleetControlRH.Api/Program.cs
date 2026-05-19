using System.Text;
using FleetControlRH.Api.Data;
using FleetControlRH.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler =
        System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(GetDatabaseConnectionString(builder.Configuration));
});

builder.Services.AddScoped<TokenService>();
builder.Services.AddHttpClient<NotaFiscalService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        var origins = (Environment.GetEnvironmentVariable("AllowedOrigins") ?? "http://localhost:5173")
            .Split(",", StringSplitOptions.RemoveEmptyEntries);

        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var jwtKey = builder.Configuration["Jwt:Key"] 
    ?? Environment.GetEnvironmentVariable("JWT__Key")
    ?? "FleetControlRH_JWT_SECRET_LOCAL_DEVELOPMENT_KEY";

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "FleetControlRH",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "FleetControlRH",
            IssuerSigningKey = key
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.EnsureCreated();

    DbSeeder.Seed(db);
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();

app.UseCors("ReactApp");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();

static string GetDatabaseConnectionString(IConfiguration configuration)
{
    var databaseUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

    if (!string.IsNullOrWhiteSpace(databaseUrl))
    {
        var uri = new Uri(databaseUrl);

        var userInfo = uri.UserInfo.Split(':');

        var username = Uri.UnescapeDataString(userInfo[0]);
        var password = userInfo.Length > 1
            ? Uri.UnescapeDataString(userInfo[1])
            : "";

        var database = uri.AbsolutePath.TrimStart('/');

        return
            $"Host={uri.Host};" +
            $"Port={uri.Port};" +
            $"Database={database};" +
            $"Username={username};" +
            $"Password={password};" +
            $"SSL Mode=Require;" +
            $"Trust Server Certificate=true";
    }

    return configuration.GetConnectionString("DefaultConnection")
        ?? "Host=localhost;Port=5432;Database=fleetcontrolrh;Username=postgres;Password=postgres";
}