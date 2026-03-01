
// Crear objeto de tipo Activo
class Activo {
    constructor(nombre, valor, unidad, fecha) {
        this.nombre = nombre;
        this.valor = valor;
        this.unidad = unidad;
        this.fecha = new Date(fecha).toLocaleDateString();
    }
}

// Función para Ingreso de Usuario
const app = {
    iniciarSesion: () => {
        const correo = document.getElementById("emailUsuario").value;
        const pass = document.getElementById("passUsuario").value;
        
        if (correo.includes("@") && pass === "1234") {
            localStorage.setItem("usuarioActivo", correo);
            app.mostrarPantallaPrivada();
        } else {
            alert("Error: Revisa tu correo o contraseña (1234)");
        }
    },

    // Función para Datos de la API
    fetchData: async (tipo) => {
        try {
            const response = await fetch(`https://mindicador.cl/api/${tipo}`);
            const data = await response.json();
            
            const ultimoDato = data.serie[0];
            const nuevoActivo = new Activo(
                data.nombre, 
                ultimoDato.valor, 
                data.unidad_medida, 
                ultimoDato.fecha
            );
            
            document.getElementById("resultadoCotizacion").innerHTML = `
                <div class="card-resultado">
                    <h3 style="margin:0; color:#00c087;">${nuevoActivo.nombre}</h3>
                    <p style="font-size: 24px; margin: 10px 0;">$${nuevoActivo.valor}</p>
                    <small>Moneda: ${nuevoActivo.unidad} | Fecha: ${nuevoActivo.fecha}</small>
                </div>
            `;

        // Historial
            app.guardarHistorial(nuevoActivo.nombre); 
        } catch (error) {
            console.error("Hubo un error con la API:", error);
        }
    },

    guardarHistorial: (nombreActivo) => {
        const usuario = localStorage.getItem("usuarioActivo");
        const clave = "historial_" + usuario;
        
        let historial = JSON.parse(localStorage.getItem(clave)) || [];

        if (historial[0] !== nombreActivo) {
            historial.unshift(nombreActivo);
            historial = historial.slice(0, 4);
            localStorage.setItem(clave, JSON.stringify(historial));
        }
        app.dibujarHistorial();
    },

    dibujarHistorial: () => {
        const usuario = localStorage.getItem("usuarioActivo");
        const historial = JSON.parse(localStorage.getItem("historial_" + usuario)) || [];
        const contenedor = document.getElementById("listaHistorial");
        
        contenedor.innerHTML = historial.map(item => 
            `<span class="itemHistorial">${item}</span>`
        ).join('');
    },

    mostrarPantallaPrivada: () => {
        const usuario = localStorage.getItem("usuarioActivo");
        if (usuario) {
            document.getElementById("seccionLogin").style.display = "none";
            document.getElementById("seccionBursatil").style.display = "block";
            document.getElementById("mensajeBienvenida").textContent = "Usuario: " + usuario;
            app.dibujarHistorial();
        }
    },

    // Cerrar sesión
    cerrarSesion: () => {
        localStorage.removeItem("usuarioActivo");
        location.reload();
    }
};

window.onload = app.mostrarPantallaPrivada;