# frozen_string_literal: true

module ResponseHelpers
  private

  def render_success(data, status: :ok, meta: nil)
    body = { data: }
    body[:meta] = meta if meta
    render json: body, status:
  end

  def render_errors(errors, status: :unprocessable_content)
    render json: { errors: Array(errors).map { |error| format_error(error) } }, status:
  end

  # Renders a command Result: the serialized value on success, its errors (422) on failure.
  def render_command_result(result, serializer:, status: :ok)
    return render_errors(result.errors) if result.failure?

    render_success(serializer.render(result.value), status:)
  end

  def format_error(error)
    case error
    when ActiveModel::Error then { field: error.attribute.to_s, message: error.full_message }
    else { field: nil, message: error.to_s }
    end
  end
end
