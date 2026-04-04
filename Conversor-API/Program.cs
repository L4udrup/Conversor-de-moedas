DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors();

var app = builder.Build();

app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader());

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapGet("/convert", async (string from, string to, decimal amount) =>
{
    var apiKey = Environment.GetEnvironmentVariable("EXCHANGE_API_KEY");
    var url = $"https://v6.exchangerate-api.com/v6/{apiKey}/pair/{from}/{to}/{amount}";

    using var httpClient = new HttpClient();

    var response = await httpClient.GetAsync(url);

    if (!response.IsSuccessStatusCode)
    {
        return Results.BadRequest("Erro ao consultar API de câmbio");
    }

    var content = await response.Content.ReadAsStringAsync();

    var json = System.Text.Json.JsonDocument.Parse(content);

    var conversionResult = json.RootElement
        .GetProperty("conversion_result")
        .GetDouble();

    return Results.Ok(new { result = conversionResult });
});

app.Run();