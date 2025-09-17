import { Injectable, InternalServerErrorException } from '@nestjs/common'
import axios from 'axios'
import FormData from 'form-data'

@Injectable()
export class FusionBrainApiService {
    constructor() {}
    // https://fusionbrain.ai/docs/doc/api-dokumentaciya/

    baseUrl = process.env.FUSION_BRAIN_URL
    xKey = process.env.FUSION_BRAIN_KEY
    xSecret = process.env.FUSION_BRAIN_SECRET

    async getPipeline(): Promise<string> {
        const url = `${this.baseUrl}key/api/v1/pipelines`
        try {
            const response = await axios.get(url, {
                headers: {
                    'X-Key': this.xKey,
                    'X-Secret': this.xSecret,
                },
            })
            return response.data[0]['id']
        } catch (error) {
            throw new InternalServerErrorException(
                'Failed to fetch pipelines from Fusion Brain API'
            )
        }
    }

    async generate(prompt: string, style: string) {
        const url = `${this.baseUrl}key/api/v1/pipeline/run`
        const pipelineId = await this.getPipeline()
        const headers = {
            'X-Key': this.xKey,
            'X-Secret': this.xSecret,
        }
        const params = {
            type: 'GENERATE',
            numImages: 1,
            width: 1024,
            height: 1024,
            generateParams: {
                query: prompt,
            },
        }

        const form = new FormData()
        form.append('pipeline_id', pipelineId)
        form.append('params', JSON.stringify(params), { contentType: 'application/json' })

        try {
            const response = await axios.post(url, form, {
                headers: {
                    ...headers,
                    ...form.getHeaders(),
                },
            })
            return response.data['uuid']
        } catch {
            throw new InternalServerErrorException('Failed from Fusion Brain API')
        }
    }

    async checkStatus(requestId: string): Promise<string | null> {
        const url = `${this.baseUrl}key/api/v1/pipeline/status/${requestId}`
        const headers = {
            'X-Key': this.xKey,
            'X-Secret': this.xSecret,
        }
        try {
            const response = await axios.get(url, { headers: headers })
            if (response.data['status'] === 'DONE') return response.data['result']['files']
            return null
        } catch {
            throw new InternalServerErrorException('Failed from Fusion Brain API')
        }
    }
}
