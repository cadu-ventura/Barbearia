import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Barbearia Hoshirara API',
      version: '1.0.0',
      description: `
        ##  API REST da Barbearia Hoshirara
        
        Sistema completo de gerenciamento para barbearias com:
        -  **Gestão de Clientes** - CRUD completo com histórico
        -  **Cadastro de Barbeiros** - Especialidades e comissões
        -  **Sistema de Agendamentos** - Controle de horários e status
        -  **Controle Financeiro** - Receitas, despesas e relatórios
        -  **Autenticação JWT** - Segurança empresarial
        -  **Rate Limiting** - Proteção contra spam
        -  **Relatórios** - Dashboards e analytics
        
        ###  Tecnologias:
        - **Backend:** TypeScript + Express.js
        - **Banco:** SQLite (promisificado)
        - **Segurança:** JWT + bcryptjs + helmet
        - **Validação:** Middleware personalizado
        - **Documentação:** Swagger/OpenAPI 3.0
      `,
      contact: {
        name: 'Suporte Técnico',
        email: 'suporte@hoshirara.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.hoshirara.com',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido no endpoint /auth/login'
        }
      },
      schemas: {
        Cliente: {
          type: 'object',
          required: ['nome', 'telefone'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do cliente',
              example: '1'
            },
            nome: {
              type: 'string',
              description: 'Nome completo do cliente',
              example: 'João Silva Santos'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do cliente',
              example: 'joao@email.com'
            },
            telefone: {
              type: 'string',
              description: 'Telefone com DDD',
              example: '(11) 99999-9999'
            },
            cpf: {
              type: 'string',
              description: 'CPF do cliente',
              example: '123.456.789-00'
            },
            data_nascimento: {
              type: 'string',
              format: 'date',
              description: 'Data de nascimento',
              example: '1990-05-15'
            },
            endereco: {
              type: 'string',
              description: 'Endereço completo',
              example: 'Rua das Flores, 123 - Vila Madalena'
            },
            observacoes: {
              type: 'string',
              description: 'Observações sobre o cliente',
              example: 'Cliente preferencial, gosta de corte baixo'
            },
            ativo: {
              type: 'boolean',
              description: 'Status ativo/inativo',
              example: true
            },
            data_cadastro: {
              type: 'string',
              format: 'date-time',
              description: 'Data de cadastro',
              example: '2024-01-15T10:30:00Z'
            },
            ultimo_atendimento: {
              type: 'string',
              format: 'date-time',
              description: 'Data do último atendimento',
              example: '2024-03-10T14:00:00Z'
            },
            total_atendimentos: {
              type: 'integer',
              description: 'Número total de atendimentos',
              example: 15
            }
          }
        },
        Barbeiro: {
          type: 'object',
          required: ['nome', 'telefone', 'cpf'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do barbeiro',
              example: '1'
            },
            nome: {
              type: 'string',
              description: 'Nome completo do barbeiro',
              example: 'Carlos Alberto'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do barbeiro',
              example: 'carlos@hoshirara.com'
            },
            telefone: {
              type: 'string',
              description: 'Telefone com DDD',
              example: '(11) 88888-8888'
            },
            cpf: {
              type: 'string',
              description: 'CPF do barbeiro',
              example: '987.654.321-00'
            },
            especialidades: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Lista de especialidades',
              example: ['Corte Masculino', 'Barba', 'Sobrancelha']
            },
            comissao: {
              type: 'number',
              format: 'float',
              description: 'Porcentagem de comissão',
              example: 40.0,
              minimum: 0,
              maximum: 100
            },
            ativo: {
              type: 'boolean',
              description: 'Status ativo/inativo',
              example: true
            },
            data_cadastro: {
              type: 'string',
              format: 'date-time',
              description: 'Data de cadastro',
              example: '2024-01-01T08:00:00Z'
            }
          }
        },
        Servico: {
          type: 'object',
          required: ['nome', 'preco', 'duracao'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do serviço',
              example: '1'
            },
            nome: {
              type: 'string',
              description: 'Nome do serviço',
              example: 'Corte Masculino + Barba'
            },
            descricao: {
              type: 'string',
              description: 'Descrição detalhada',
              example: 'Corte personalizado com máquina e tesoura, barba alinhada'
            },
            preco: {
              type: 'number',
              format: 'float',
              description: 'Preço em reais',
              example: 35.00,
              minimum: 0
            },
            duracao: {
              type: 'integer',
              description: 'Duração em minutos',
              example: 45,
              minimum: 1
            },
            categoria: {
              type: 'string',
              enum: ['corte', 'barba', 'sobrancelha', 'hidratacao', 'combo', 'outros'],
              description: 'Categoria do serviço',
              example: 'combo'
            },
            ativo: {
              type: 'boolean',
              description: 'Status ativo/inativo',
              example: true
            }
          }
        },
        Agendamento: {
          type: 'object',
          required: ['cliente_id', 'barbeiro_id', 'servico_ids', 'data_hora'],
          properties: {
            id: {
              type: 'string',
              description: 'ID único do agendamento',
              example: '1'
            },
            cliente_id: {
              type: 'string',
              description: 'ID do cliente',
              example: '1'
            },
            barbeiro_id: {
              type: 'string',
              description: 'ID do barbeiro',
              example: '1'
            },
            servico_ids: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'IDs dos serviços',
              example: ['1', '2']
            },
            data_hora: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora do agendamento',
              example: '2024-03-20T14:30:00Z'
            },
            status: {
              type: 'string',
              enum: ['agendado', 'em_andamento', 'concluido', 'cancelado', 'nao_compareceu'],
              description: 'Status do agendamento',
              example: 'agendado'
            },
            observacoes: {
              type: 'string',
              description: 'Observações do agendamento',
              example: 'Cliente pediu para não cortar muito'
            },
            valor_total: {
              type: 'number',
              format: 'float',
              description: 'Valor total calculado',
              example: 45.00
            },
            data_criacao: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
              example: '2024-03-15T10:00:00Z'
            }
          }
        },
        Usuario: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '1'
            },
            nome: {
              type: 'string',
              example: 'Admin User'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@hoshirara.com'
            },
            tipo: {
              type: 'string',
              enum: ['admin', 'funcionario', 'barbeiro'],
              example: 'admin'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'admin@hoshirara.com'
            },
            password: {
              type: 'string',
              description: 'Senha do usuário',
              example: 'admin123',
              minLength: 6
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['nome', 'email', 'password', 'role'],
          properties: {
            nome: {
              type: 'string',
              description: 'Nome completo do usuário',
              example: 'João Silva',
              minLength: 2,
              maxLength: 100
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'joao@hoshirara.com'
            },
            password: {
              type: 'string',
              description: 'Senha do usuário (mín. 8 caracteres com maiúscula, minúscula, número e especial)',
              example: 'MinhaSenh@123',
              minLength: 8,
              pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'
            },
            role: {
              type: 'string',
              enum: ['admin', 'funcionario', 'barbeiro'],
              description: 'Tipo de usuário',
              example: 'funcionario'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login realizado com sucesso'
            },
            data: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  description: 'Token JWT para autenticação',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                },
                user: {
                  $ref: '#/components/schemas/Usuario'
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Erro de validação'
            },
            error: {
              type: 'string',
              example: 'Campo obrigatório não informado'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operação realizada com sucesso'
            },
            data: {
              type: 'object',
              description: 'Dados retornados (opcional)'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Auth',
        description: 'Autenticação e autorização'
      },
      {
        name: 'Clientes',
        description: 'Gestão de clientes'
      },
      {
        name: 'Barbeiros',
        description: 'Gestão de barbeiros'
      },
      {
        name: 'Serviços',
        description: 'Gestão de serviços'
      },
      {
        name: 'Agendamentos',
        description: 'Sistema de agendamentos'
      },
      {
        name: 'Financeiro',
        description: 'Controle financeiro'
      }
    ]
  },
  apis: [
    __dirname + '/../routes/*.ts',
    __dirname + '/../server.ts'
  ]
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };