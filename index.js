const fs = require("fs").promises;
const path = require("path");

class Database {
    constructor(file) {
        if (!file || typeof file !== 'string' || !file.trim()) {
            throw new Error("Database file path must be a valid non-empty string.");
        }

        this.file = path.resolve(file);
    }

    /** Verifica se o arquivo existe e lê o conteúdo */
    async #read() {
        // método privado, não precisa de JSDoc para tooltip
        try {
            const content = await fs.readFile(this.file, "utf-8");

            if (!content.trim()) {
                await this.#save([]);
                return [];
            }

            const data = JSON.parse(content);

            if (!Array.isArray(data)) {
                throw new Error("Database content is corrupted. Expected an array.");
            }

            return data;
        } catch (err) {
            if (err.code === "ENOENT") {
                await this.#save([]);
                return [];
            } else if (err instanceof SyntaxError) {
                console.error(`[Database Error] Invalid JSON format in file: ${this.file}`);
                throw new Error("Database file contains invalid JSON.");
            }

            console.error(`[Database Error] Failed to read database: ${err.message}`);
            throw err;
        }
    }

    /** Salva dados no arquivo */
    async #save(data) {
        if (!Array.isArray(data)) {
            throw new Error("Data must be an array.");
        }

        try {
            await fs.writeFile(
                this.file,
                JSON.stringify(data, null, 2),
                { encoding: 'utf-8' }
            );
        } catch (err) {
            console.error(`[Database Error] Failed to save data: ${err.message}`);
            throw err;
        }
    }

    /**
     * Cria um novo registro na base de dados.
     * @param {Object} data - Objeto com os dados do novo registro.
     * @returns {Promise<Object>} O item criado com ID gerado.
     * @throws {Error} Se os dados forem inválidos ou houver conflito de ID.
     */
    async create(data) {
        if (!data || typeof data !== 'object' || Array.isArray(data)) {
            throw new Error("Data must be a valid object.");
        }

        const items = await this.#read();

        const id = items.length > 0 ? Math.max(...items.map(e => e.id || 0)) + 1 : 1;

        if (items.some(e => e.id === id)) {
            throw new Error(`ID conflict: An item with ID ${id} already exists.`);
        }

        const item = { id, ...data };

        items.push(item);
        await this.#save(items);

        return item;
    }

    /**
     * Retorna todos os registros da base de dados.
     * @returns {Promise<Array>} Array com todos os registros.
     */
    async getAll() {
        return await this.#read();
    }

    /**
     * Busca um registro pelo seu ID.
     * @param {number} id - ID do registro.
     * @returns {Promise<Object|null>} O registro encontrado ou null se não existir.
     * @throws {Error} Se o ID não for um inteiro positivo.
     */
    async getById(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID must be a positive integer.");
        }

        const items = await this.#read();
        return items.find(e => e.id === id) ?? null;
    }

    /**
     * Atualiza um registro existente.
     * @param {number} id - ID do registro a ser atualizado.
     * @param {Object} payload - Dados para atualização.
     * @returns {Promise<Object>} O registro atualizado.
     * @throws {Error} Se o ID for inválido ou o registro não existir.
     */
    async update(id, payload) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID must be a positive integer.");
        }

        if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
            throw new Error("Payload must be a valid object.");
        }

        const items = await this.#read();
        const index = items.findIndex(e => e.id === id);

        if (index === -1) {
            throw new Error(`Item with ID ${id} does not exist.`);
        }

        const updatedItem = {
            ...items[index],
            ...payload,
            id, // Garante que o ID não será alterado
        };

        items[index] = updatedItem;
        await this.#save(items);

        return updatedItem;
    }

    /**
     * Remove um registro pelo seu ID.
     * @param {number} id - ID do registro a ser removido.
     * @returns {Promise<Object>} O registro removido.
     * @throws {Error} Se o ID for inválido ou o registro não existir.
     */
    async remove(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("ID must be a positive integer.");
        }

        const items = await this.#read();
        const index = items.findIndex(e => e.id === id);

        if (index === -1) {
            throw new Error(`Item with ID ${id} does not exist.`);
        }

        const removedItem = items[index];
        const updatedItems = items.filter(e => e.id !== id);

        await this.#save(updatedItems);

        return removedItem;
    }
}

module.exports = Database;
