import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';

// Definir el esquema GraphQL
const typeDefs = gql`
  type Empresa {
    id: ID!
    nombre: String!
    clientes: [Cliente!]!
  }

  type Cliente {
    id: ID!
    nombre: String!
    empresaId: ID!
    facturas: [Factura!]!
  }

  type Factura {
    id: ID!
    numero: String!
    clienteId: ID!
    detalles: [DetalleFactura!]!
  }

  type DetalleFactura {
    id: ID!
    facturaId: ID!
    producto: Producto!
    cantidad: Int!
    precio: Float!
  }

  type Producto {
    id: ID!
    nombre: String!
    precio: Float!
  }

  type Query {
    empresas: [Empresa!]!
    clientes(empresaId: ID!): [Cliente!]!
    facturas(clienteId: ID!): [Factura!]!
    detallesFactura(facturaId: ID!): [DetalleFactura!]!
  }

  type Mutation {
    addEmpresa(nombre: String!): Empresa
    updateCliente(id: ID!, nombre: String!): Cliente
    deleteFactura(id: ID!): Factura
  }
`;

// Datos de ejemplo para simular múltiples empresas, clientes, facturas, detalles de factura y productos
const empresas = [
  { id: '1', nombre: 'Empresa A' },
  { id: '2', nombre: 'Empresa B' },
];

const clientes = [
  { id: '1', nombre: 'Cliente 1', empresaId: '1' },
  { id: '2', nombre: 'Cliente 2', empresaId: '1' },
  { id: '3', nombre: 'Cliente 3', empresaId: '2' },
  { id: '4', nombre: 'Cliente 4', empresaId: '2' },
];

const facturas = [
  { id: '1', numero: 'F001', clienteId: '1' },
  { id: '2', numero: 'F002', clienteId: '1' },
  { id: '3', numero: 'F003', clienteId: '2' },
  { id: '4', numero: 'F004', clienteId: '2' },
  { id: '5', numero: 'F005', clienteId: '3' },
];

const detallesFactura = [
  { id: '1', facturaId: '1', producto: { id: '1', nombre: 'Producto 1', precio: 10.0 }, cantidad: 2, precio: 20.0 },
  { id: '2', facturaId: '1', producto: { id: '2', nombre: 'Producto 2', precio: 15.0 }, cantidad: 1, precio: 15.0 },
  { id: '3', facturaId: '2', producto: { id: '1', nombre: 'Producto 1', precio: 10.0 }, cantidad: 3, precio: 30.0 },
  { id: '4', facturaId: '3', producto: { id: '3', nombre: 'Producto 3', precio: 25.0 }, cantidad: 2, precio: 50.0 },
  { id: '5', facturaId: '4', producto: { id: '2', nombre: 'Producto 2', precio: 15.0 }, cantidad: 2, precio: 30.0 },
];

const productos = [
  { id: '1', nombre: 'Producto 1', precio: 10.0 },
  { id: '2', nombre: 'Producto 2', precio: 15.0 },
  { id: '3', nombre: 'Producto 3', precio: 25.0 },
];

// Definir los resolvers que resuelven las consultas GraphQL
const resolvers = {
  Query: {
    empresas: () => empresas,
    clientes: (_, { empresaId }) => clientes.filter(cliente => cliente.empresaId === empresaId),
    facturas: (_, { clienteId }) => facturas.filter(factura => factura.clienteId === clienteId),
    detallesFactura: (_, { facturaId }) => detallesFactura.filter(detalle => detalle.facturaId === facturaId),
  },
  Empresa: {
    clientes: (empresa) => clientes.filter(cliente => cliente.empresaId === empresa.id),
  },
  Cliente: {
    facturas: (cliente) => facturas.filter(factura => factura.clienteId === cliente.id),
  },
  Factura: {
    detalles: (factura) => detallesFactura.filter(detalle => detalle.facturaId === factura.id),
  },

  Mutation: {
    addEmpresa: (_, { nombre }) => {
      const newEmpresa = {
        id: String(empresas.length + 1),
        nombre,
      };
      empresas.push(newEmpresa);
      return newEmpresa;
    },
    updateCliente: (_, { id, nombre }) => {
      const cliente = clientes.find(c => c.id === id);
      if (cliente) {
        cliente.nombre = nombre;
        return cliente;
      }
      return null;
    },
    deleteFactura: (_, { id }) => {
      const index = facturas.findIndex(f => f.id === id);
      if (index !== -1) {
        const deletedFactura = facturas.splice(index, 1);
        return deletedFactura[0];
      }
      return null;
    },
  },
};

// Crear una instancia del servidor Apollo pasando el esquema y los resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const { url } = await startStandaloneServer(server);
console.log(`🚀🚀🚀 Servidor en Linea en el Puerto ==> ${url}`);
