const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: string;
    email: string;
  };
  message?: string;
  expires_in?: number;
}

export interface Image {
  id: number;
  filename: string;
  file_size: number;
  original_path: string;
  thumbnail_path: string;
  uploaded_at: string;
  thumbnail_url: string;
  original_url: string;
}

export interface ImageMetadata {
  description: string | null;
  tags: string[];
  colors: string[];
  ai_processing_status: string;
}

export interface ImageDetail extends Image {
  metadata: ImageMetadata;
}

export interface ImagesResponse {
  images: Image[];
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface DeleteImageResponse {
  message: string;
  image_id: number;
}

export interface ColorItem {
  color: string;
  count: number;
}

export interface ColorsResponse {
  colors: ColorItem[];
  total: number;
}

export interface TagsResponse {
  tags: string[];
  count: number;
}

export interface SimilarImage {
  id: number;
  filename: string;
  display_name: string;
  similarity_percentage: number;
  thumbnail_url: string;
  original_url: string;
  tags: string[];
  colors: string[];
  description: string;
}

export interface SimilarImagesResponse {
  reference_image_id: number;
  similar_images: SimilarImage[];
  count: number;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        // Handle 401 Unauthorized - session expired
        if (response.status === 401) {
          // Dispatch custom event for session expiration
          window.dispatchEvent(new CustomEvent("session-expired"));
        }

        const error = await response.json().catch(() => ({
          detail: response.statusText,
        }));
        // Handle both "detail" and "message" formats
        const errorMessage = error.detail || error.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async refreshSession(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  }

  // Add authorization header for authenticated requests
  async authenticatedRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = localStorage.getItem("authToken");

    return this.request<T>(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }

  // Get all images with pagination and filters
  async getImages(
    pageSize: number = 20,
    pageNumber: number = 1,
    search?: string,
    tags?: string[],
    colors?: string[],
    sortBy?: string
  ): Promise<ImagesResponse> {
    const params = new URLSearchParams();
    params.append('pageSize', pageSize.toString());
    params.append('pageNumber', pageNumber.toString());

    if (search && search.trim()) params.append('search', search.trim());
    if (tags && tags.length > 0) params.append('tags', tags.join(','));
    if (colors && colors.length > 0) params.append('colors', colors.join(','));
    if (sortBy && sortBy !== 'recent') params.append('sort_by', sortBy);

    const url = `/images?${params.toString()}`;
    console.log('Fetching images from:', url);

    return this.authenticatedRequest<ImagesResponse>(url);
  }

  // Get a single image by ID
  async getImageById(imageId: number): Promise<ImageDetail> {
    return this.authenticatedRequest<ImageDetail>(`/images/${imageId}`);
  }

  // Delete an image by ID
  async deleteImage(imageId: number): Promise<DeleteImageResponse> {
    return this.authenticatedRequest<DeleteImageResponse>(`/images/${imageId}`, {
      method: "DELETE",
    });
  }

  // Upload a new image
  async uploadImage(file: File): Promise<any> {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("file", file);

    const url = `${BASE_URL}/images/upload`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: response.statusText,
      }));
      const errorMessage = error.detail || error.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  // Upload multiple images
  async uploadImages(files: File[]): Promise<any> {
    const token = localStorage.getItem("authToken");
    const formData = new FormData();

    // Append all files to FormData
    files.forEach((file) => {
      formData.append("files", file);
    });

    const url = `${BASE_URL}/images/upload/bulk`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: response.statusText,
      }));
      const errorMessage = error.detail || error.message || `HTTP error! status: ${response.status}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  // Get recent tags
  async getRecentTags(): Promise<TagsResponse> {
    return this.authenticatedRequest<TagsResponse>(`/tags/recent`);
  }

  // Get popular colors
  async getPopularColors(limit: number = 10): Promise<ColorsResponse> {
    return this.authenticatedRequest<ColorsResponse>(`/colors/popular?limit=${limit}`);
  }

  // Get similar images
  async getSimilarImages(imageId: number, limit: number = 6): Promise<SimilarImagesResponse> {
    return this.authenticatedRequest<SimilarImagesResponse>(`/images/${imageId}/similar?limit=${limit}`);
  }

  // Update image metadata
  async updateImageMetadata(
    imageId: number,
    data: {
      description?: string;
      tags?: string[];
      colors?: string[];
    }
  ): Promise<{ message: string; image_id: number; metadata: ImageMetadata }> {
    return this.authenticatedRequest(`/images/${imageId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

export const apiService = new ApiService();
