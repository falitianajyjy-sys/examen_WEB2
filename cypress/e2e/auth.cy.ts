describe("Authentification", () => {
    it("connecte l'admin avec les bons identifiants", () => {
        cy.request("POST", "/api/auth/login", {
            email: "falitianajyjy@gmail.com",
            password: "jyan35112",
        }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property("token");
            expect(response.body.role).to.eq("admin");
        });
    });

    it("refuse un mauvais mot de passe", () => {
        cy.request({
            method: "POST",
            url: "/api/auth/login",
            body: { email: "falitianajyjy@gmail.com", password: "mauvais" },
            failOnStatusCode: false,
        }).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.body.message).to.eq("Email ou mot de passe incorrect");
        });
    });
});