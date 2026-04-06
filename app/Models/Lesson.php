<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    protected $fillable = [
        'module_id',
        'title',
        'description',
        'content',
        'video_url',
        'video_duration',
        'pdf_file',
        'type',
        'is_free',
        'is_published',
        'order',
        'views_count',
        'materials',
        'attachments',
    ];

    protected $casts = [
        'is_free' => 'boolean',
        'is_published' => 'boolean',
        'materials' => 'array',
        'attachments' => 'array',
    ];

    // Relacionamentos
    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function progress(): HasMany
    {
        return $this->hasMany(Progress::class);
    }

    // Helpers
    public function getCourseAttribute(): Course
    {
        return $this->module->course;
    }

    /**
     * Converte URL do YouTube para formato de embed
     */
    public function getEmbedUrlAttribute(): ?string
    {
        if (!$this->video_url) {
            return null;
        }

        $url = $this->video_url;
        
        // Se já é uma URL de embed, retorna como está
        if (strpos($url, 'youtube.com/embed/') !== false) {
            return $url;
        }

        // Extrair ID do vídeo de diferentes formatos
        $videoId = null;

        // Formato: https://www.youtube.com/watch?v=VIDEO_ID
        if (preg_match('/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/', $url, $matches)) {
            $videoId = $matches[1];
        }

        if ($videoId) {
            return "https://www.youtube.com/embed/{$videoId}";
        }

        // Se não conseguir extrair, retorna a URL original
        return $url;
    }
}
