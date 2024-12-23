document.getElementById('expenseForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        nome: document.getElementById('nome').value,
        data: document.getElementById('data').value,
        descricao: document.getElementById('descricao').value,
        valor: parseFloat(document.getElementById('valor').value),
        local: document.getElementById('local').value
    };

    try {
        const response = await fetch('/api/gastos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        document.getElementById('message').innerText = result.message;
        if (response.ok) {
            document.getElementById('expenseForm').reset();
        }
    } catch (error) {
        document.getElementById('message').innerText = 'Erro no envio dos dados.';
    }
});
